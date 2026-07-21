"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Zap, MessageSquare, Sparkles } from "lucide-react";
import type { Listing, Service } from "@/types";
import { getListings, getServices } from "@/lib/api";
import { ListingCard } from "@/components/shared/listing-card";
import { ServiceCard } from "@/components/shared/service-card";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified students only",
    body: "Every account is checked against university records before it can trade.",
    color: "text-crimson-light bg-crimson/12",
  },
  {
    icon: Zap,
    title: "Fast local delivery",
    body: "Get items delivered between hostels and campus buildings in minutes.",
    color: "text-gold bg-gold/12",
  },
  {
    icon: MessageSquare,
    title: "Chat before you buy",
    body: "Message sellers and providers directly to ask questions and agree on details.",
    color: "text-blue-400 bg-blue-500/15",
  },
];

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getListings().then((res) => setListings(res.slice(0, 4)));
    getServices().then((res) => setServices(res.slice(0, 4)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-crimson/20 to-surface">
        <div className="absolute inset-0 bg-glow opacity-80" />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-crimson/15 blur-3xl animate-float" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-crimson/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-elevated/80 border border-neutral-800 px-3 py-1 text-xs font-medium text-gold-light backdrop-blur-sm mb-6 animate-slide-up">
            <Sparkles className="h-3 w-3" />
            Built for Africa Nazarene University
          </div>
          <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Buy, sell, and get things done
            <span className="text-crimson-light"> — right on campus.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-neutral-400 sm:text-base leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
            CampusConnect is the marketplace built for verified students to trade items
            and book services with people they can actually trust.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/marketplace"
              className="btn-crimson !px-6 !py-3 !text-sm"
            >
              Browse Marketplace
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/services"
              className="btn-outline !border-neutral-600 !text-neutral-300 hover:!bg-surface-elevated !px-6 !py-3 !text-sm"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-12 -mt-8 relative z-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card rounded-2xl p-5 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-neutral-100">{f.title}</h3>
              <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently listed */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">Recently listed</h2>
          <Link href="/marketplace" className="text-sm text-crimson-light font-medium hover:text-crimson transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing, i) => (
            <div key={listing.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </section>

      {/* Popular services */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">Popular services</h2>
          <Link href="/services" className="text-sm text-crimson-light font-medium hover:text-crimson transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {services.map((service, i) => (
            <div key={service.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
