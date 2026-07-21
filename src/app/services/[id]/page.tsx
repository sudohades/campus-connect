"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, Loader2, CheckCircle2 } from "lucide-react";
import type { Service, PaymentMethod, User } from "@/types";
import { getService, bookService, getOrCreateChat } from "@/lib/api";
import { findUserById } from "@/data/users";
import { useSession } from "@/lib/session-context";
import { RatingStars } from "@/components/shared/rating-stars";
import { formatCurrency, delay } from "@/lib/utils";

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "mpesa", label: "M-Pesa" },
  { value: "airtel_money", label: "Airtel Money" },
  { value: "card", label: "Card" },
];

const UNIT_LABEL: Record<Service["priceUnit"], string> = {
  fixed: "flat rate",
  hourly: "/ hour",
  per_session: "/ session",
};

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useSession();

  const [service, setService] = useState<Service | null>(null);
  const [provider, setProvider] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentMethod>("mpesa");
  const [booking, setBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState<string>("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    getService(id).then((res) => {
      setService(res ?? null);
      if (res) setProvider(findUserById(res.providerId));
      setLoading(false);
    });
  }, [id]);

  async function handleBook() {
    if (!user || !service) return;
    setBooking(true);
    setBookingStep("Checking availability...");
    await delay(600);
    setBookingStep("Processing payment...");
    await delay(800);
    await bookService({ buyerId: user.id, serviceId: service.id, paymentMethod: payment });
    setBookingStep("Booking confirmed");
    await delay(400);
    setBooking(false);
    setDone(true);
  }

  async function handleMessageProvider() {
    if (!user || !service) return;
    await getOrCreateChat(user.id, service.providerId, { serviceId: service.id });
    router.push("/chats");
  }

  if (loading) {
    return <div className="px-4 py-16 text-center text-sm text-neutral-500">Loading...</div>;
  }
  if (!service) {
    return <div className="px-4 py-16 text-center text-sm text-neutral-500">Service not found.</div>;
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center animate-fade-in">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-7 w-7 text-emerald-400" />
        </div>
        <h1 className="text-lg font-semibold text-neutral-50">Booking confirmed</h1>
        <p className="mt-1.5 max-w-xs text-sm text-neutral-400 leading-relaxed">
          {provider?.name ?? "The provider"} has been notified of your booking for &quot;{service.title}&quot;.
        </p>
        <button
          onClick={() => router.push("/dashboard/orders")}
          className="btn-crimson mt-6"
        >
          View my bookings
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2 animate-fade-in">
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-surface-overlay to-neutral-800 text-sm text-neutral-400 font-medium border border-neutral-800 relative overflow-hidden">
        <span className="relative z-10">{service.title}</span>
        <div className="absolute inset-0 bg-gradient-to-br from-crimson/8 to-transparent" />
      </div>

      <div>
        <span className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
          <Clock className="h-3 w-3 text-neutral-600" />
          {service.durationMinutes} minutes
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-50 tracking-tight">{service.title}</h1>
        <p className="mt-2 text-2xl font-bold text-crimson-light tracking-tight">
          {formatCurrency(service.price)}{" "}
          <span className="text-sm font-normal text-neutral-500">
            {UNIT_LABEL[service.priceUnit]}
          </span>
        </p>
        <p className="mt-4 text-sm text-neutral-400 leading-relaxed">{service.description}</p>

        {provider && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-neutral-800 bg-surface-raised p-3.5">
            <div>
              <p className="text-sm font-medium text-neutral-100">{provider.name}</p>
              <RatingStars rating={provider.rating} count={provider.ratingCount} />
            </div>
            <button
              onClick={handleMessageProvider}
              className="btn-outline !px-3 !py-1.5 !text-xs"
            >
              Message
            </button>
          </div>
        )}

        {user && user.id !== service.providerId && (
          <div className="mt-6 rounded-xl border border-neutral-800 bg-surface-raised p-5 shadow-soft">
            <h2 className="mb-3.5 text-sm font-semibold text-neutral-100">Book this service</h2>
            <label className="mb-1.5 block text-xs font-medium text-neutral-400">
              Payment method
            </label>
            <div className="mb-4 flex gap-2">
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
            <button
              onClick={handleBook}
              disabled={booking}
              className="btn-crimson w-full"
            >
              {booking ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {bookingStep}
                </>
              ) : (
                `Book for ${formatCurrency(service.price)}`
              )}
            </button>
          </div>
        )}

        {!user && (
          <p className="mt-6 text-sm text-neutral-500">
            Log in with a university email to book this service.
          </p>
        )}
      </div>
    </div>
  );
}
