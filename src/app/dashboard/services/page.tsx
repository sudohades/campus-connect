"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench } from "lucide-react";
import type { Service } from "@/types";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentState, setCurrentState } from "@/lib/state";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency, cn } from "@/lib/utils";

export default function ProviderServicesPage() {
  const { user } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  function refresh() {
    if (!user) return;
    setServices(currentState.services.filter((s) => s.providerId === user.id));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function toggleStatus(serviceId: string) {
    const services2 = currentState.services.map((s) =>
      s.id === serviceId ? { ...s, status: s.status === "active" ? ("paused" as const) : ("active" as const) } : s,
    );
    setCurrentState({ ...currentState, services: services2 });
    refresh();
  }

  if (!user) return null;

  return (
    <DashboardShell role={user.role}>
      <h1 className="mb-6 page-title">My Services</h1>

      {services.length === 0 ? (
        <EmptyState icon={Wrench} title="No services listed yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((s) => (
            <div key={s.id} className="card animate-fade-in">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-100">{s.title}</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {formatCurrency(s.price)} · {s.bookingsCompleted} bookings completed
                </p>
              </div>
              <button
                onClick={() => toggleStatus(s.id)}
                className={cn(
                  "self-start btn-outline !px-3 !py-1.5 !text-xs",
                  s.status === "paused" && "!border-crimson/30 !text-crimson-light !bg-crimson/10 hover:!bg-crimson/15",
                )}
              >
                {s.status === "active" ? "Pause" : "Reactivate"}
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
