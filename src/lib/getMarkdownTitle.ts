import fs from 'fs';
import path from 'path';

export function getMarkdownTitle(filePath: string): string | null {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^# (.+)$/m);
  return match ? match[1].trim() : null;
}

export function getSubpagesWithTitles(baseDir: string) {
    const subpages: { slug: string; title: string }[] = [];
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const mdPath = path.join(baseDir, entry.name, 'index.pt.md');
        if (fs.existsSync(mdPath)) {
          const title = getMarkdownTitle(mdPath) || entry.name;
          subpages.push({
            slug: entry.name,
            title,
          });
        }
      }
    }
    return subpages;
  }