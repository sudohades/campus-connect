"use client";

import { useEffect, useMemo, useState } from "react";
import { Wrench } from "lucide-react";
import type { Service } from "@/types";
import { getServices } from "@/lib/api";
import { ServiceCard } from "@/components/shared/service-card";
import { SearchFilters } from "@/components/shared/search-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { SERVICE_CATEGORIES } from "@/lib/constants";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setLoading(true);
    getServices({ query, category: category as Service["category"] | "all" }).then((res) => {
      setServices(res);
      setLoading(false);
    });
  }, [query, category]);

  const heading = useMemo(
    () => (loading ? "Searching..." : `${services.length} services found`),
    [loading, services.length],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="page-title">Services</h1>
        <p className="mt-1 subtitle">
          Book help from fellow students — tutoring, design, repairs, and more.
        </p>
      </div>

      <SearchFilters
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        categories={SERVICE_CATEGORIES}
        placeholder="Search services..."
        className="mb-6"
      />

      <p className="mb-3 text-xs text-neutral-500 font-medium">{heading}</p>

      {!loading && services.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No services found"
          description="Try a different search term or category."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
