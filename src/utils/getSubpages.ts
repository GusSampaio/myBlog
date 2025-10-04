import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getSubpages(dir: string, lang: string) {
  const subpages: { slug: string, title: string, excerpt?: string, date?: string }[] = [];
  if (!fs.existsSync(dir)) return subpages;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const mdPath = path.join(dir, entry.name, `index.${lang}.md`);
      if (fs.existsSync(mdPath)) {
        try {
          const file = fs.readFileSync(mdPath, 'utf8');
          const { data } = matter(file);
          subpages.push({
            slug: entry.name,
            title: data.title?.[lang] || data.title || entry.name,
            excerpt: data.excerpt?.[lang] || data.excerpt || '',
            date: data.date || '',
          });
        } catch (e) {
          const fileContent = fs.readFileSync(mdPath, 'utf8');
          console.error(`Erro ao processar ${mdPath}:`, e);
          console.error('Conteúdo do arquivo problemático:\n', fileContent);
        }
      }
    }
  }
  return subpages;
} 