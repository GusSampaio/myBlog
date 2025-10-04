'use server';
import Link from "next/link";
import { translations } from "@/lib/translations";
import path from 'path';
import { getSubpages } from '@/utils/getSubpages';
import React from 'react';

interface BlogPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang } = await params;
  const locale = (lang === 'en' || lang === 'pt') ? lang : 'pt';
  const translationsForLang = translations[locale];
  const t = translationsForLang.explore;
  const dir = path.join(process.cwd(), 'src', 'content', 'blog');
  const subpages = getSubpages(dir, lang);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">{t.blog}</h1>
      <div className="grid gap-8">
        {subpages
          .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
          .map(sub => (
            <article key={sub.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <Link href={`/${lang}/blog/${sub.slug}`} className="block">
                <h1 className="text-2xl font-bold mb-2 hover:text-primary transition-colors">
                  {sub.title}
                </h1>
              </Link>
              <div className="text-gray-600 dark:text-gray-400 mb-4">
                <time dateTime={sub.date}>
                  {sub.date ? new Date(sub.date).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : ''}
                </time>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{sub.excerpt}</p>
            </article>
          ))}
      </div>
    </div>
  );
} 