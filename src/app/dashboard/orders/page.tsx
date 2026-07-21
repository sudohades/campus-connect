"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import type { Order } from "@/types";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getOrdersForUser, updateOrderStatus } from "@/lib/api";
import { findListingById } from "@/data/listings";
import { findUserById } from "@/data/users";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

const SELLER_ACTIONS: Record<string, { next: Order["status"]; label: string }> = {
  placed: { next: "accepted", label: "Accept order" },
  accepted: { next: "dispatched", label: "Mark dispatched" },
  dispatched: { next: "delivered", label: "Mark delivered" },
  delivered: { next: "completed", label: "Mark completed" },
};

export default function OrdersPage() {
  const { user } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  async function refresh() {
    if (!user) return;
    const as = user.role === "seller" ? "seller" : "buyer";
    setOrders(await getOrdersForUser(user.id, as));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;
  const isSeller = user.role === "seller";

  return (
    <DashboardShell role={user.role}>
      <h1 className="mb-6 page-title">
        {isSeller ? "Orders Received" : "My Orders"}
      </h1>

      {orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const listing = findListingById(order.listingId);
            const counterpart = findUserById(isSeller ? order.buyerId : order.sellerId);
            const action = isSeller ? SELLER_ACTIONS[order.status] : undefined;

            return (
              <div key={order.id} className="card animate-fade-in">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-100">{listing?.title ?? "Listing"}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {isSeller ? "Buyer" : "Seller"}: {counterpart?.name ?? "Unknown"} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  {action && (
                    <button
                      onClick={async () => {
                        await updateOrderStatus(order.id, action.next);
                        refresh();
                      }}
                      className="btn-outline !px-3 !py-1.5 !text-xs"
                    >
                      {action.label}
                    </button>
                  )}
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
