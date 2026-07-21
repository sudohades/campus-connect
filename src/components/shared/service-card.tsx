import Link from "next/link";
import { Clock } from "lucide-react";
import type { Service } from "@/types";
import { formatCurrency } from "@/lib/utils";

const UNIT_LABEL: Record<Service["priceUnit"], string> = {
  fixed: "flat rate",
  hourly: "/ hour",
  per_session: "/ session",
};

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-surface-raised shadow-soft transition-all duration-200 hover:shadow-card-hover hover:border-neutral-700 hover:-translate-y-0.5"
    >
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-surface-overlay to-neutral-800 text-xs text-neutral-400 font-medium relative overflow-hidden">
        <span className="relative z-10">{service.title}</span>
        <div className="absolute inset-0 bg-gradient-to-br from-crimson/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-100 group-hover:text-crimson-light transition-colors duration-150">
          {service.title}
        </h3>
        <p className="line-clamp-2 text-xs text-neutral-500 leading-relaxed">{service.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-neutral-800">
          <p className="text-base font-semibold text-crimson-light tracking-tight">
            {formatCurrency(service.price)}{" "}
            <span className="text-xs font-normal text-neutral-500">
              {UNIT_LABEL[service.priceUnit]}
            </span>
          </p>
          <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
            <Clock className="h-3 w-3 text-neutral-600" />
            {service.durationMinutes}m
          </span>
        </div>
      </div>
    </Link>
  );
}
