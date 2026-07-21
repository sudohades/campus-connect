"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import type { Review } from "@/types";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentState } from "@/lib/state";
import { findUserById } from "@/data/users";
import { findListingById } from "@/data/listings";
import { findServiceById } from "@/data/services";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

export default function ReviewsPage() {
  const { user } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    setReviews(currentState.reviews.filter((r) => r.authorId === user.id));
  }, [user]);

  if (!user) return null;

  return (
    <DashboardShell role={user.role}>
      <h1 className="mb-6 page-title">My Reviews</h1>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Reviews you leave will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => {
            const target = findUserById(review.targetUserId);
            const listing = review.listingId ? findListingById(review.listingId) : undefined;
            const service = review.serviceId ? findServiceById(review.serviceId) : undefined;
            const item = listing?.title ?? service?.title;

            return (
              <div
                key={review.id}
                className="card animate-fade-in"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-100">
                      Review for {target?.name ?? "Unknown"}
                    </p>
                    {item && (
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {listing ? "Listing" : "Service"}: {item}
                      </p>
                    )}
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
                <p className="mt-3 text-sm text-neutral-400 leading-relaxed">{review.comment}</p>
                <p className="mt-2 text-[10px] text-neutral-600 font-medium">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
