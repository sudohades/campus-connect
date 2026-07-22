"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Loader2, CheckCircle2, Bike } from "lucide-react";
import type { Listing, PaymentMethod, User } from "@/types";
import { getListing, purchaseListing, getOrCreateChat } from "@/lib/api";
import { findUserById } from "@/data/users";
import { useSession } from "@/lib/session-context";
import { RatingStars } from "@/components/shared/rating-stars";
import { StatusBadge } from "@/components/shared/status-badge";
import { CAMPUS_LOCATIONS } from "@/lib/constants";
import { formatCurrency, delay } from "@/lib/utils";

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "mpesa", label: "M-Pesa" },
  { value: "airtel_money", label: "Airtel Money" },
  { value: "card", label: "Card" },
];

type Stage = "idle" | "processing" | "assigning" | "done";
type PaymentLabel = "idle" | "processing" | "confirming" | "assigning" | "done";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useSession();

  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentMethod>("mpesa");
  const [dropoff, setDropoff] = useState(CAMPUS_LOCATIONS[0]);
  const [stage, setStage] = useState<Stage>("idle");
  const [paymentLabel, setPaymentLabel] = useState<PaymentLabel>("idle");
  const [rider, setRider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getListing(id).then((res) => {
      setListing(res ?? null);
      if (res) setSeller(findUserById(res.sellerId));
      setLoading(false);
    });
  }, [id]);

  async function handlePurchase() {
    if (!user || !listing) return;
    setError(null);
    setStage("processing");
    setPaymentLabel("processing");
    try {
      await delay(800);
      setPaymentLabel("confirming");
      await delay(600);
      const result = await purchaseListing({
        buyerId: user.id,
        listingId: listing.id,
        paymentMethod: payment,
        deliverToLocation: dropoff,
      });
      setStage("assigning");
      setPaymentLabel("assigning");
      await delay(500);
      setRider(result.deliveryRequest.riderName ?? null);
      setStage("done");
      setPaymentLabel("done");
    } catch {
      setError("Something went wrong processing this order.");
      setStage("idle");
      setPaymentLabel("idle");
    }
  }

  async function handleMessageSeller() {
    if (!user || !listing) return;
    await getOrCreateChat(user.id, listing.sellerId, { listingId: listing.id });
    router.push("/chats");
  }

  if (loading) {
    return <div className="px-4 py-16 text-center text-sm text-neutral-500">Loading...</div>;
  }
  if (!listing) {
    return <div className="px-4 py-16 text-center text-sm text-neutral-500">Listing not found.</div>;
  }

  if (stage === "done") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center animate-fade-in">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-7 w-7 text-emerald-400" />
        </div>
        <h1 className="text-lg font-semibold text-neutral-50">Order confirmed</h1>
        <p className="mt-1.5 max-w-xs text-sm text-neutral-400 leading-relaxed">
          {rider ? `${rider} has been assigned to deliver your order to ${dropoff}.` : "Your order is being prepared."}
        </p>
        <button
          onClick={() => router.push("/dashboard/orders")}
          className="btn-crimson mt-6"
        >
          View my orders
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2 animate-fade-in">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-surface-elevated to-surface-overlay text-sm text-neutral-500 font-medium border border-neutral-800">
        {listing.images[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          listing.title
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <StatusBadge status={listing.status} />
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <MapPin className="h-3 w-3 text-neutral-600" />
            {listing.location}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-50 tracking-tight">{listing.title}</h1>
        <p className="mt-2 text-2xl font-bold text-crimson-light tracking-tight">
          {formatCurrency(listing.price)}
        </p>
        <p className="mt-4 text-sm text-neutral-400 leading-relaxed">{listing.description}</p>

        {seller && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-neutral-800 bg-surface-raised p-3.5">
            <div>
              <p className="text-sm font-medium text-neutral-100">{seller.name}</p>
              <RatingStars rating={seller.rating} count={seller.ratingCount} />
            </div>
            <button
              onClick={handleMessageSeller}
              className="btn-outline !px-3 !py-1.5 !text-xs"
            >
              Message
            </button>
          </div>
        )}

        {user && listing.status === "active" && user.id !== listing.sellerId && (
          <div className="mt-6 rounded-xl border border-neutral-800 bg-surface-raised p-5 shadow-soft">
            <h2 className="mb-3.5 text-sm font-semibold text-neutral-100">Buy this item</h2>

            <label className="mb-1.5 block text-xs font-medium text-neutral-400">
              Payment method
            </label>
            <div className="mb-3.5 flex gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setPayment(m.value)}
                  className={`flex-1 rounded-xl border px-2 py-2.5 text-xs font-medium transition-all duration-150 ${
                    payment === m.value
                      ? "border-crimson/30 bg-crimson/10 text-crimson-light shadow-sm"
                      : "border-neutral-700 text-neutral-400 hover:bg-surface-elevated"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <label className="mb-1.5 block text-xs font-medium text-neutral-400">
              Deliver to
            </label>
            <select
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              className="select-field mb-4"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {error && (
              <p className="mb-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</p>
            )}

            <button
              onClick={handlePurchase}
              disabled={stage !== "idle"}
              className="btn-crimson w-full"
            >
              {stage === "processing" && paymentLabel === "processing" && (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Processing M-Pesa payment...
                </>
              )}
              {stage === "processing" && paymentLabel === "confirming" && (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Confirming transaction...
                </>
              )}
              {stage === "assigning" && (
                <>
                  <Bike className="h-3.5 w-3.5" />
                  Searching for rider...
                </>
              )}
              {stage === "idle" && `Pay ${formatCurrency(listing.price)}`}
            </button>
          </div>
        )}

        {!user && (
          <p className="mt-6 text-sm text-neutral-500">
            Log in with a university email to purchase this item.
          </p>
        )}
      </div>
    </div>
  );
}
