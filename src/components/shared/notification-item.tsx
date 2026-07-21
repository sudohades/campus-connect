import { MessageSquare, ShoppingBag, Tag, Calendar, Star, Bell, Shield } from "lucide-react";
import type { Notification, NotificationType } from "@/types";
import { cn, timeAgo } from "@/lib/utils";

const ICONS: Record<NotificationType, typeof Bell> = {
  message: MessageSquare,
  purchase: ShoppingBag,
  sale: Tag,
  booking: Calendar,
  review: Star,
  system: Bell,
  admin: Shield,
};

const ICON_COLORS: Record<NotificationType, string> = {
  message: "bg-blue-500/15 text-blue-400",
  purchase: "bg-emerald-500/15 text-emerald-400",
  sale: "bg-gold/12 text-gold-light",
  booking: "bg-purple-500/15 text-purple-400",
  review: "bg-gold/12 text-gold-light",
  system: "bg-surface-elevated text-neutral-500",
  admin: "bg-crimson/12 text-crimson-light",
};

interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = ICONS[notification.type];
  const colorClass = ICON_COLORS[notification.type];

  return (
    <button
      type="button"
      onClick={() => onClick?.(notification)}
      className={cn(
        "flex w-full items-start gap-3 border-b border-neutral-800 px-4 py-3.5 text-left transition-all duration-150 hover:bg-surface-elevated",
        !notification.read && "bg-crimson/[0.04]",
      )}
    >
      <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", colorClass)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-neutral-100">{notification.title}</p>
        <p className="line-clamp-2 mt-0.5 text-xs text-neutral-400 leading-relaxed">{notification.body}</p>
        <p className="mt-1.5 text-[10px] text-neutral-600 font-medium">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.read && (
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold shadow-glow-gold/40" />
      )}
    </button>
  );
}
