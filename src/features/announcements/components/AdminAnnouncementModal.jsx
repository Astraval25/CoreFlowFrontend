import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MdCampaign, MdClose, MdOpenInNew } from "react-icons/md";
import { coreApi } from "../../../shared/services/coreApi";

const sessionKeyFor = (announcement) =>
  `cf_announcement_seen_session:${announcement?.announcementKey || announcement?.announcementId}`;

const isAdminToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;
    return String(jwtDecode(token)?.role || "").toUpperCase() === "ADM";
  } catch {
    return false;
  }
};

const isExternalUrl = (url) => /^https?:\/\//i.test(url || "");

const AdminAnnouncementModal = () => {
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdminToken()) return;

    let cancelled = false;
    coreApi
      .getCurrentAnnouncement()
      .then((res) => {
        if (cancelled) return;
        const current = res?.data?.responseData;
        if (!current?.announcementId) return;
        if (sessionStorage.getItem(sessionKeyFor(current)) === "1") return;
        setAnnouncement(current);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (!announcement) return null;

  const closeAnnouncement = async ({ openAction = false } = {}) => {
    setError("");

    if (dontShowAgain) {
      try {
        setSaving(true);
        await coreApi.dismissAnnouncement(announcement.announcementId);
      } catch {
        setSaving(false);
        setError("Could not save your preference. Please try again.");
        return;
      }
    }

    try {
      sessionStorage.setItem(sessionKeyFor(announcement), "1");
    } catch {
      // ignore storage failures; the modal can still be closed
    }

    const actionUrl = openAction ? announcement.actionUrl : "";
    setSaving(false);
    setAnnouncement(null);

    if (!actionUrl) return;
    if (isExternalUrl(actionUrl)) {
      window.open(actionUrl, "_blank", "noopener");
      return;
    }
    navigate(actionUrl.startsWith("/") ? actionUrl : `/${actionUrl}`);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-overlay px-4">
      <div className="w-full max-w-md rounded-lg border border-line bg-surface shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-9 w-9 shrink-0 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <MdCampaign size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-app-text">{announcement.title}</p>
              <p className="text-[11px] text-app-muted">CoreFlow update</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => closeAnnouncement()}
            disabled={saving}
            className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-app-sub hover:bg-surface-soft disabled:opacity-60"
            title="Close"
          >
            <MdClose size={18} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-sm leading-6 text-app-text whitespace-pre-line">
            {announcement.message}
          </p>

          <label className="mt-4 flex items-center gap-2 text-xs font-medium text-app-sub">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span>Don't Show Again</span>
          </label>

          {error && (
            <p className="mt-3 rounded-lg border border-danger-alert-border bg-danger-alert-bg px-3 py-2 text-xs text-danger-alert-text">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={() => closeAnnouncement()}
            disabled={saving}
            className="btn-ghost disabled:opacity-60"
          >
            {saving ? "Saving..." : "Close"}
          </button>
          {announcement.actionUrl && announcement.actionLabel && (
            <button
              type="button"
              onClick={() => closeAnnouncement({ openAction: true })}
              disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              <MdOpenInNew size={15} />
              {announcement.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementModal;
