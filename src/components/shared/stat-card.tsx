import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  tone?: "neutral" | "accent" | "gold";
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, tone = "neutral", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "card group relative overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
          {label}
        </span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
            tone === "accent" && "bg-crimson/12 text-crimson-light group-hover:bg-crimson/20 group-hover:shadow-glow-crimson/20",
            tone === "gold" && "bg-gold/12 text-gold-light group-hover:bg-gold/18 group-hover:shadow-glow-gold/20",
            tone === "neutral" && "bg-surface-elevated text-neutral-500 group-hover:bg-surface-hover group-hover:text-neutral-400",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold text-neutral-50 tracking-tight">{value}</p>
      {trend && <p className="mt-1 text-xs text-neutral-500">{trend}</p>}
    </div>
  );
}
