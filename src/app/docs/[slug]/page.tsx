import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { getDocBySlug } from "@/lib/docs";
import { MarkdownRenderer } from "@/components/docs/MarkdownRenderer";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { ReadingProgress } from "@/components/docs/ReadingProgress";
import { BackToTop } from "@/components/docs/BackToTop";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = getDocBySlug(params.slug);
  if (!doc) return { title: "Not Found" };
  return { title: `${doc.title} — CampusConnect Docs` };
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const doc = getDocBySlug(params.slug);
  if (!doc) notFound();

  return (
    <>
      <ReadingProgress />
      <BackToTop />
      <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-in">
        <Link
          href="/docs"
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Documentation
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-50 tracking-tight">
            {doc.title}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {doc.readingTime}
            </span>
            <span className="text-neutral-700">|</span>
            <span>Rendered from {doc.filename}</span>
          </div>
        </div>

        <div className="flex gap-10">
          <article className="min-w-0 flex-1 max-w-3xl">
            <MarkdownRenderer content={doc.content} />
          </article>

          <aside className="hidden w-56 shrink-0 lg:block">
            <TableOfContents headings={doc.headings} />
          </aside>
        </div>
      </div>
    </>
  );
}
