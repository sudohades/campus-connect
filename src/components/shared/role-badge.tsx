import { BadgeCheck, Clock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole, VerificationStatus } from "@/types";

const ROLE_LABELS: Record<UserRole, string> = {
  buyer: "Buyer",
  seller: "Seller",
  service_provider: "Service Provider",
  admin: "Administrator",
};

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-neutral-700 bg-surface-elevated px-2.5 py-0.5 text-[11px] font-medium text-neutral-400 tracking-wide",
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

export function VerificationBadge({
  status,
  className,
}: {
  status: VerificationStatus;
  className?: string;
}) {
  const config = {
    verified: {
      icon: BadgeCheck,
      label: "Verified Student",
      classes: "bg-crimson/12 text-crimson-light",
    },
    pending: {
      icon: Clock,
      label: "Pending Verification",
      classes: "bg-gold/12 text-gold-light",
    },
    unverified: {
      icon: ShieldAlert,
      label: "Unverified",
      classes: "bg-surface-elevated text-neutral-500",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        config.classes,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
