"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package } from "lucide-react";
import type { Listing, ListingCategory, ListingCondition } from "@/types";
import { useSession } from "@/lib/session-context";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { createListing } from "@/lib/api";
import { currentState } from "@/lib/state";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LISTING_CATEGORIES, LISTING_CONDITIONS, CAMPUS_LOCATIONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function SellerListingsPage() {
  const { user } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createStep, setCreateStep] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "electronics" as ListingCategory,
    condition: "good" as ListingCondition,
    location: CAMPUS_LOCATIONS[0],
  });

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  function refresh() {
    if (!user) return;
    setListings(currentState.listings.filter((l) => l.sellerId === user.id));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setCreateStep("Uploading images...");
    await new Promise((r) => setTimeout(r, 500));
    setCreateStep("Publishing listing...");
    await createListing({
      title: form.title,
      description: form.description,
      price: Number(form.price) || 0,
      category: form.category,
      condition: form.condition,
      location: form.location,
      sellerId: user.id,
      images: [],
    });
    setCreateStep("Listing published successfully");
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    setCreateStep("");
    setShowForm(false);
    setForm({ title: "", description: "", price: "", category: "electronics", condition: "good", location: CAMPUS_LOCATIONS[0] });
    refresh();
  }

  if (!user) return null;

  return (
    <DashboardShell role={user.role}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="page-title">My Listings</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-crimson !px-3.5 !py-2 !text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          New Listing
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-neutral-800 bg-surface-raised p-5 shadow-soft sm:grid-cols-2 animate-slide-up">
          <input
            required
            placeholder="Title"
            aria-label="Listing title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="input-field sm:col-span-2"
          />
          <textarea
            required
            placeholder="Description"
            aria-label="Listing description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="input-field sm:col-span-2"
            rows={3}
          />
          <input
            required
            type="number"
            min={0}
            placeholder="Price (KES)"
            aria-label="Price in KES"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="input-field"
          />
          <select
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            aria-label="Pickup location"
            className="select-field"
          >
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ListingCategory }))}
            aria-label="Listing category"
            className="select-field"
          >
            {LISTING_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={form.condition}
            onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value as ListingCondition }))}
            aria-label="Item condition"
            className="select-field"
          >
            {LISTING_CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="btn-crimson sm:col-span-2"
          >
            {submitting ? createStep : "Publish listing"}
          </button>
        </form>
      )}

      {listings.length === 0 ? (
        <EmptyState icon={Package} title="No listings yet" description="Create your first listing to start selling." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-surface-raised shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-overlay text-xs text-neutral-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-2.5 font-medium">Title</th>
                <th className="whitespace-nowrap px-4 py-2.5 font-medium">Price</th>
                <th className="whitespace-nowrap px-4 py-2.5 font-medium">Status</th>
                <th className="whitespace-nowrap px-4 py-2.5 font-medium">Views</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-t border-neutral-800 transition-colors hover:bg-surface-elevated">
                  <td className="whitespace-nowrap px-4 py-2.5 text-neutral-100 font-medium">{l.title}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-crimson-light font-semibold">{formatCurrency(l.price)}</td>
                  <td className="whitespace-nowrap px-4 py-2.5"><StatusBadge status={l.status} /></td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-neutral-500">{l.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
