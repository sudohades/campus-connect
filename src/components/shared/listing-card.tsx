import Link from "next/link";
import { MapPin, Heart } from "lucide-react";
import type { Listing } from "@/types";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-surface-raised shadow-soft transition-all duration-200 hover:shadow-card-hover hover:border-neutral-700 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-surface-elevated to-surface-overlay">
        {listing.images[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500 font-medium">
            {listing.title}
          </div>
        )}
        {listing.status !== "active" && (
          <div className="absolute left-2.5 top-2.5">
            <StatusBadge status={listing.status} />
          </div>
        )}
        <button
          type="button"
          aria-label="Save listing"
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-surface-overlay/80 text-neutral-500 shadow-soft backdrop-blur-sm transition-all duration-150 hover:text-crimson-light hover:shadow-glow-crimson/20 hover:scale-110"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-100 group-hover:text-crimson-light transition-colors duration-150">
            {listing.title}
          </h3>
        </div>
        <p className="text-base font-semibold text-crimson-light tracking-tight">
          {formatCurrency(listing.price)}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 text-[11px] text-neutral-500 border-t border-neutral-800">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-neutral-600" />
            {listing.location}
          </span>
          <span className="font-medium">{timeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
