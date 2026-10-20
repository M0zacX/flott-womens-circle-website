// All admin dates are shown in Abuja time (Africa/Lagos, WAT), e.g. "6 Oct 2026".
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PARTS = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function parts(iso: string) {
  const out: Record<string, string> = {};
  for (const p of PARTS.formatToParts(new Date(iso))) out[p.type] = p.value;
  return out;
}

export function formatDate(iso: string): string {
  const p = parts(iso);
  return `${Number(p.day)} ${MONTHS[Number(p.month) - 1]} ${p.year}`;
}

export function formatDateTime(iso: string): string {
  const p = parts(iso);
  const hour = p.hour === "24" ? "00" : p.hour;
  return `${formatDate(iso)}, ${hour}:${p.minute} WAT`;
}
