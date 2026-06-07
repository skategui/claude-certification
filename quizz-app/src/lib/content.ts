import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "..");
const CONTENT_DIR = path.join(ROOT, "content");
const QUIZZ_DIR = path.join(ROOT, "quizz");

export type ContentFile = {
  slug: string;
  title: string;
  source: "content" | "quizz";
  body: string;
};

const titleFromMd = (body: string, fallback: string): string => {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
};

const walkMd = async (dir: string): Promise<string[]> => {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkMd(full)));
    } else if (e.isFile() && e.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
};

export const getAllContent = async (): Promise<ContentFile[]> => {
  const result: ContentFile[] = [];
  for (const [dir, source] of [
    [CONTENT_DIR, "content"],
    [QUIZZ_DIR, "quizz"],
  ] as const) {
    try {
      const files = await walkMd(dir);
      for (const file of files) {
        const rel = path.relative(dir, file).replace(/\.md$/, "");
        const body = await fs.readFile(file, "utf-8");
        result.push({
          slug: `${source}__${rel.replace(/\//g, "__")}`,
          title: titleFromMd(body, rel),
          source,
          body,
        });
      }
    } catch {
      // dir missing → skip
    }
  }
  return result.sort((a, b) => a.title.localeCompare(b.title));
};

export const getContentBySlug = async (slug: string): Promise<ContentFile | null> => {
  const all = await getAllContent();
  return all.find((c) => c.slug === slug) ?? null;
};

export const getCorpus = async (): Promise<string> => {
  const all = await getAllContent();
  return all
    .map((c) => `## SOURCE: ${c.source}/${c.slug}\n\n${c.body}`)
    .join("\n\n---\n\n");
};
