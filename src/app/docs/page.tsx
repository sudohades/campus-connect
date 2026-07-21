import Link from "next/link";
import { FileText, Play, CheckSquare, Clock, ArrowRight } from "lucide-react";
import { getAllDocs } from "@/lib/docs";

const ICONS: Record<string, typeof FileText> = {
  readme: FileText,
  "demo-guide": Play,
  requirements: CheckSquare,
};

export default function DocsPage() {
  const docs = getAllDocs();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-fade-in">
      <div className="mb-10">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gold-light">
          Documentation
        </p>
        <h1 className="text-3xl font-bold text-neutral-50 tracking-tight">
          Documentation Center
        </h1>
        <p className="mt-2 max-w-lg text-sm text-neutral-400 leading-relaxed">
          Everything you need to understand, present, and contribute to CampusConnect.
          These documents are the single source of truth — rendered directly from Markdown.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => {
          const Icon = ICONS[doc.slug] || FileText;
          return (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="group card-hover rounded-2xl p-6 flex flex-col"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-crimson/10 text-crimson-light transition-all duration-200 group-hover:bg-crimson/15 group-hover:shadow-glow-crimson/10">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-base font-semibold text-neutral-50 tracking-tight">
                {doc.title}
              </h2>
              <p className="mt-1.5 flex-1 text-xs text-neutral-500 leading-relaxed">
                {doc.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-neutral-600">
                  <Clock className="h-3 w-3" />
                  {doc.readingTime}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-crimson-light transition-colors group-hover:text-crimson">
                  Read
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
