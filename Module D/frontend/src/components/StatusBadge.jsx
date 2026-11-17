import { ADVERT_STATUSES } from "../constants";

export default function StatusBadge({ status, className = "" }) {
  const meta = ADVERT_STATUSES[status] || {
    label: status || "Неизвестно",
    tone: "gray",
  };

  return (
    <span className={`badge badge--${meta.tone} ${className}`.trim()}>
      {meta.label}
    </span>
  );
}

const SERVICE_META = {
  top: { label: "TOP", tone: "amber" },
  vip: { label: "VIP", tone: "violet" },
};

export function ServiceBadge({ name, className = "" }) {
  const meta = SERVICE_META[String(name || "").toLowerCase()];

  if (!meta) return null;

  return (
    <span className={`badge badge--${meta.tone} ${className}`.trim()}>
      {meta.label}
    </span>
  );
}
