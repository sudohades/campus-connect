import fs from "fs";
import path from "path";

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  filename: string;
  readingTime: string;
}

export interface Doc extends DocMeta {
  content: string;
  headings: { id: string; text: string; level: number }[];
}

const ROOT = process.cwd();

const DOCS_REGISTRY: DocMeta[] = [
  {
    slug: "readme",
    title: "README",
    description: "Project overview, tech stack, getting started guide, routes, and project structure.",
    filename: "README.md",
    readingTime: "4 min read",
  },
  {
    slug: "demo-guide",
    title: "Demo Guide",
    description: "Step-by-step walkthrough for presenting CampusConnect to an audience.",
    filename: "DEMO_GUIDE.md",
    readingTime: "8 min read",
  },
  {
    slug: "requirements",
    title: "Requirements Mapping",
    description: "Complete mapping of project requirements to implementation status.",
    filename: "REQUIREMENTS_MAPPING.md",
    readingTime: "6 min read",
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractHeadings(markdown: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = markdown.split("\n");
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,6})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~\[\]]/g, "").trim();
      headings.push({ id: slugify(text), text, level });
    }
  }

  return headings;
}

function estimateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function getAllDocs(): DocMeta[] {
  return DOCS_REGISTRY;
}

export function getDocBySlug(slug: string): Doc | null {
  const meta = DOCS_REGISTRY.find((d) => d.slug === slug);
  if (!meta) return null;

  const filePath = path.join(ROOT, meta.filename);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf-8");
  const headings = extractHeadings(content);

  return { ...meta, content, headings };
}

export function getAllSlugs(): string[] {
  return DOCS_REGISTRY.map((d) => d.slug);
}
