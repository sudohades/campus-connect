"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import type { Transaction } from "@/types";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentState, setCurrentState } from "@/lib/state";
import { findServiceById } from "@/data/services";
import { findUserById } from "@/data/users";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

type BookingState = "confirmed" | "completed";

export default function ProviderBookingsPage() {
  const { user } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Transaction[]>([]);
  const [localStatus, setLocalStatus] = useState<Record<string, BookingState>>({});

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  function refresh() {
    if (!user) return;
    setBookings(
      currentState.transactions.filter((t) => t.sellerId === user.id && t.serviceId),
    );
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  return (
    <DashboardShell role={user.role}>
      <h1 className="mb-6 page-title">Bookings</h1>

      {bookings.length === 0 ? (
        <EmptyState icon={Calendar} title="No bookings yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => {
            const service = booking.serviceId ? findServiceById(booking.serviceId) : undefined;
            const buyer = findUserById(booking.buyerId);
            const state = localStatus[booking.id];

            return (
              <div key={booking.id} className="card animate-fade-in">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-100">{service?.title ?? "Service"}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {buyer?.name ?? "Student"} · {formatDate(booking.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!state && (
                    <button
                      onClick={() => setLocalStatus((s) => ({ ...s, [booking.id]: "confirmed" }))}
                      className="btn-outline !px-3 !py-1.5 !text-xs"
                    >
                      Confirm booking
                    </button>
                  )}
                  {state === "confirmed" && (
                    <button
                      onClick={() => {
                        setLocalStatus((s) => ({ ...s, [booking.id]: "completed" }));
                        if (service) {
                          const services2 = currentState.services.map((sv) =>
                            sv.id === service.id
                              ? { ...sv, bookingsCompleted: sv.bookingsCompleted + 1 }
                              : sv,
                          );
                          setCurrentState({ ...currentState, services: services2 });
                        }
                      }}
                      className="btn-crimson !px-3 !py-1.5 !text-xs"
                    >
                      Mark completed
                    </button>
                  )}
                  {state === "completed" && (
                    <span className="text-xs font-medium text-emerald-400">Completed</span>
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
