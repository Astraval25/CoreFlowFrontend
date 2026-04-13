import { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const useNotifications = (options = {}) => {
  const { enabled = true } = options;
  const [companyId, setCompanyId] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = jwtDecode(token);
    const compId = decoded?.defaultComp?.[0];
    if (!compId) return;
    setCompanyId(compId);
  }, []);

  const fetchUnreadCount = useCallback(async (compId) => {
    if (!compId) return;
    try {
      const res = await coreApi.getUnreadNotificationCount(compId);
      setUnreadCount(res?.data?.responseData?.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch unread notification count:", error);
      setUnreadCount(0);
    }
  }, []);

  const emitNotificationUpdate = useCallback((compId) => {
    window.dispatchEvent(
      new CustomEvent("notifications:updated", {
        detail: { companyId: compId },
      })
    );
  }, []);

  const fetchNotifications = useCallback(async (compId, p) => {
    if (!compId) return;
    setLoading(true);
    try {
      const res = await coreApi.getNotifications(compId, p);
      const data = res?.data?.responseData;
      setNotifications(data?.notifications || []);
      setHasNext(data?.hasNext || false);
      setHasPrevious(data?.hasPrevious || false);
      setTotalPages(data?.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !companyId) return;
    fetchNotifications(companyId, page);
    fetchUnreadCount(companyId);
  }, [enabled, companyId, page, fetchNotifications, fetchUnreadCount]);

  const markRead = async (notificationId) => {
    if (!companyId) return;
    try {
      await coreApi.markNotificationRead(companyId, notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true, readDt: new Date().toISOString() } : n
        )
      );
      setUnreadCount((count) => Math.max(count - 1, 0));
      emitNotificationUpdate(companyId);
    } catch (error) {
      console.error("Failed to mark notification read:", error);
    }
  };

  const markAllRead = async () => {
    if (!companyId) return;
    try {
      await coreApi.markAllNotificationsRead(companyId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readDt: new Date().toISOString() })));
      setUnreadCount(0);
      emitNotificationUpdate(companyId);
    } catch (error) {
      console.error("Failed to mark all read:", error);
    }
  };

  const goNext = () => { if (hasNext) setPage((p) => p + 1); };
  const goPrev = () => { if (hasPrevious) setPage((p) => p - 1); };

  const refresh = useCallback(async () => {
    if (!enabled || !companyId) return;
    await fetchNotifications(companyId, page);
    await fetchUnreadCount(companyId);
  }, [enabled, companyId, page, fetchNotifications, fetchUnreadCount]);

  return {
    companyId,
    notifications,
    unreadCount,
    loading,
    page,
    hasNext,
    hasPrevious,
    totalPages,
    markRead,
    markAllRead,
    goNext,
    goPrev,
    refresh,
  };
};

export default useNotifications;
