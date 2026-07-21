"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0 },
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24" aria-label="Table of contents">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
        On this page
      </p>
      <ul className="space-y-1 border-l border-neutral-800">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block border-l -ml-px py-1 text-xs transition-all duration-150",
                heading.level === 1 && "pl-3 font-medium",
                heading.level === 2 && "pl-3",
                heading.level === 3 && "pl-6",
                heading.level >= 4 && "pl-9",
                activeId === heading.id
                  ? "border-l-crimson text-neutral-100"
                  : "border-transparent text-neutral-500 hover:text-neutral-300 hover:border-neutral-600",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
