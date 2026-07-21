import { cn } from "@/lib/utils";

type Tone = "neutral" | "positive" | "warning" | "negative" | "info" | "gold";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-neutral-700/50 text-neutral-400",
  positive: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  negative: "bg-red-500/15 text-red-400",
  info: "bg-blue-500/15 text-blue-400",
  gold: "bg-gold/12 text-gold-light",
};

const STATUS_TONE: Record<string, Tone> = {
  active: "positive",
  pending: "warning",
  sold: "neutral",
  removed: "negative",
  paused: "neutral",
  placed: "info",
  accepted: "info",
  dispatched: "warning",
  delivered: "positive",
  completed: "positive",
  cancelled: "negative",
  failed: "negative",
  processing: "warning",
  refunded: "neutral",
  open: "warning",
  reviewing: "info",
  investigating: "info",
  resolved: "positive",
  dismissed: "neutral",
  unassigned: "neutral",
  rider_assigned: "info",
  picked_up: "info",
  in_transit: "warning",
};

function toLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = STATUS_TONE[status] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {toLabel(status)}
    </span>
  );
}
