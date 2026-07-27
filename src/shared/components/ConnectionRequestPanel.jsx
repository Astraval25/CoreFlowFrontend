import { useState } from "react";
import { MdCheck, MdHourglassTop, MdLinkOff, MdSync, MdWarning } from "react-icons/md";

const statusMeta = {
  PENDING: {
    icon: <MdHourglassTop size={18} />,
    badge: "badge-orange",
    title: "Connection approval pending",
    text: "This partner is on CoreFlow. Orders and payments are blocked until both companies accept the connection.",
  },
  ACCEPTED: {
    icon: <MdCheck size={18} />,
    badge: "badge-blue",
    title: "Connection accepted",
    text: "Both companies can create orders and payments for this linked partner.",
  },
  REJECTED: {
    icon: <MdLinkOff size={18} />,
    badge: "badge-red",
    title: "Connection rejected",
    text: "Orders and payments are blocked. Accept again only when both companies agree to reconnect.",
  },
};

const ConnectionRequestPanel = ({
  status,
  linkedCompanyName,
  entityLabel,
  onAccept,
  onReject,
}) => {
  const [saving, setSaving] = useState("");
  const normalizedStatus = status || "";
  const meta = statusMeta[normalizedStatus];

  if (!meta) {
    return (
      <div className="rounded-lg border border-line bg-surface-soft p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-app-sub">
            <MdSync size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-app-text">Offline partner</p>
            <p className="mt-1 text-xs leading-relaxed text-app-sub">
              No CoreFlow account was matched for this {entityLabel}. You can create orders and payments normally.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const runAction = async (action, callback) => {
    if (!callback) return;
    setSaving(action);
    try {
      await callback();
    } finally {
      setSaving("");
    }
  };

  const showActions = normalizedStatus === "PENDING" || normalizedStatus === "REJECTED";

  return (
    <div className="rounded-lg border border-line bg-surface-soft p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-brand">
            {meta.icon}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-extrabold text-app-text">{meta.title}</p>
              <span className={`badge ${meta.badge}`}>{normalizedStatus}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-app-sub">{meta.text}</p>
            {linkedCompanyName && (
              <p className="mt-2 text-xs font-semibold text-app-text">
                Matched company: <span className="text-brand">{linkedCompanyName}</span>
              </p>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary text-xs"
              disabled={Boolean(saving)}
              onClick={() => runAction("accept", onAccept)}
            >
              <MdCheck size={14} />
              {saving === "accept" ? "Accepting..." : "Accept"}
            </button>
            <button
              type="button"
              className="btn-ghost text-xs text-danger"
              disabled={Boolean(saving)}
              onClick={() => runAction("reject", onReject)}
            >
              <MdWarning size={14} />
              {saving === "reject" ? "Rejecting..." : "Reject"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionRequestPanel;
