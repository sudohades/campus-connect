"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import type { Notification } from "@/types";
import { getNotifications, markNotificationRead } from "@/lib/api";
import { useSession } from "@/lib/session-context";
import { NotificationItem } from "@/components/shared/notification-item";
import { EmptyState } from "@/components/shared/empty-state";

export default function NotificationsPage() {
  const { user, refresh } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    getNotifications(user.id).then(setNotifications);
  }, [user]);

  async function handleClick(notification: Notification) {
    if (!notification.read) {
      await markNotificationRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
      );
      refresh();
    }
    if (notification.link) router.push(notification.link);
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState icon={Bell} title="Log in to view notifications" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-fade-in">
      <h1 className="mb-5 page-title">Notifications</h1>
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="No notifications yet." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-surface-raised shadow-soft">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onClick={handleClick} />
          ))}
        </div>
      )}
    </div>
  );
}
