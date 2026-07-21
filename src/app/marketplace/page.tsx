"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";
import type { Listing } from "@/types";
import { getListings } from "@/lib/api";
import { ListingCard } from "@/components/shared/listing-card";
import { SearchFilters } from "@/components/shared/search-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { LISTING_CATEGORIES } from "@/lib/constants";

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setLoading(true);
    getListings({ query, category: category as Listing["category"] | "all" }).then((res) => {
      setListings(res);
      setLoading(false);
    });
  }, [query, category]);

  const heading = useMemo(
    () => (loading ? "Searching..." : `${listings.length} items found`),
    [loading, listings.length],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="page-title">Marketplace</h1>
        <p className="mt-1 subtitle">
          Buy and sell items directly with verified students.
        </p>
      </div>

      <SearchFilters
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        categories={LISTING_CATEGORIES}
        placeholder="Search listings..."
        className="mb-6"
      />

      <p className="mb-3 text-xs text-neutral-500 font-medium">{heading}</p>

      {!loading && listings.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No listings found"
          description="Try a different search term or category."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
