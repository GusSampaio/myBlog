'use server';
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { notFound } from 'next/navigation';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw'; 
import Link from 'next/link';
import { translations } from "@/lib/translations";
import 'katex/dist/katex.min.css';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import BlogContentWrapper from '@/components/blog/BlogContentWrapper';
import BlogPageLayout from '@/components/blog/BlogPageLayout';
import { ChevronRight, Home, BookOpen } from 'lucide-react';
import { parseYamlFrontmatter } from '@/lib/posts';

interface BlogPost {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  content: string;
}

async function getPostBySlug(slugArr: string[], lang: string): Promise<BlogPost | null> {
  const postsDirectory = join(process.cwd(), 'src', 'content', 'blog', ...slugArr);
  const filePath = join(postsDirectory, `index.${lang}.md`);
  try {
    const content = await readFile(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return null;
    const frontmatter = frontmatterMatch[1];
    const metadata = parseYamlFrontmatter(frontmatter);
    const bodyStart = frontmatterMatch[0].length;
    const postBody = content.slice(bodyStart).trim();
    return {
      title: metadata.title || 'Sem título',
      slug: metadata.slug || slugArr[slugArr.length - 1],
      date: metadata.date || '',
      tags: metadata.tags || [],
      content: postBody
    };
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return null;
  }
}

async function getSubcontents(slugArr: string[], lang: string): Promise<{ slug: string, title: string }[]> {
  const postsDirectory = join(process.cwd(), 'src', 'content', 'blog', ...slugArr);
  let entries: string[] = [];
  try {
    entries = await readdir(postsDirectory);
  } catch {
    return [];
  }

  // Ordenar: primeiro por número no início (dois dígitos), depois alfabético
  entries = entries.sort((a, b) => {
    const numA = a.match(/^(\d{2})/);
    const numB = b.match(/^(\d{2})/);
    if (numA && numB) {
      return parseInt(numA[1], 10) - parseInt(numB[1], 10);
    } else if (numA) {
      return -1;
    } else if (numB) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  });

  const subcontents: { slug: string, title: string }[] = [];
  for (const entry of entries) {
    const entryPath = join(postsDirectory, entry);
    try {
      const entryStat = await stat(entryPath);
      if (entryStat.isDirectory()) {
        const subFilePath = join(entryPath, `index.${lang}.md`);
        try {
          const subContent = await readFile(subFilePath, 'utf-8');
          const frontmatterMatch = subContent.match(/^---\s*\n([\s\S]*?)\n---/);

          let title = entry;
          if (frontmatterMatch) {
            const metadata = parseYamlFrontmatter(frontmatterMatch[1]);
            title = metadata.title || entry;
          }
          subcontents.push({ slug: entry, title });
        } catch { }
      }
    } catch { }
  }
  return subcontents;
}

type Props = {
  params: Promise<{ lang: string; slug?: string[] }>
};

export default async function BlogSubPostPage({ params }: Props) {
  const resolvedparams = await params;
  const lang = resolvedparams.lang;
  const slugArr = resolvedparams.slug ?? [];
  if (!slugArr.length) return notFound();


  const locale = (lang === 'en' || lang === 'pt') ? lang : 'pt';
  const translationsForLang = translations[locale];

  const post = await getPostBySlug(slugArr, lang);
  const postsMap: Record<string, string> = {};
  for (let i = 0; i < slugArr.length; i++) {
    const partialSlugArr = slugArr.slice(0, i + 1);
    const partialPost = await getPostBySlug(partialSlugArr, lang);
    if (partialPost) {
      postsMap[slugArr[i]] = partialPost.title;
    }
  }
  const subcontents = await getSubcontents(slugArr, lang);

  if (!post) {
    notFound();
  }

  // Processar o markdown com suporte a LaTeX
  let htmlContent;
  console.log('Iniciando processamento do conteúdo');

  try {
    htmlContent = await unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeKatex, {
        strict: false,
        throwOnError: false,
        errorColor: '#cc0000'
      })
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, {
        behavior: 'wrap',
        properties: {
          className: ['anchor-link']
        }
      })
      .use(rehypeStringify)
      .process(post.content);
  } catch (error: any) {
    console.error('ERRO NO PROCESSAMENTO MARKDOWN:', error);
    console.error('Stack trace:', error.stack);
    console.error('Conteúdo que causou erro:', post.content);

    // Fallback: retornar conteúdo sem processamento LaTeX
    try {
      htmlContent = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(post.content);
      console.log('Fallback executado com sucesso');
    } catch (fallbackError: any) {
      console.error('ERRO NO FALLBACK:', fallbackError);
      htmlContent = `<p>Erro ao processar conteúdo: ${error.message}</p>`;
    }
  }

  return (
    <BlogPageLayout htmlContent={htmlContent.toString()}>
      {/* Breadcrumb de navegação moderno */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <Link
            href={`/${lang}`}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Home size={18} />
            <span className="text-sm font-medium">{translationsForLang.navigation.home}</span>
          </Link>
          
          <ChevronRight size={16} className="text-gray-400" />

          <Link
            href={`/${lang}/projects`}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <BookOpen size={18} />
            <span className="text-sm font-medium">{translationsForLang.navigation.projects}</span>
          </Link>

          {slugArr.length > 0 && (
            <>
              <ChevronRight size={16} className="text-gray-400" />

              {slugArr.map((slug, idx) => {
                const path = `/${lang}/projects/${slugArr.slice(0, idx + 1).join('/')}`;
                const isLast = idx === slugArr.length - 1;

                // Título do item atual (pelo mapa ou pelo próprio post)
                const title = isLast && post ? post.title : postsMap[slug] || slug;

                return (
                  <div key={slug} className="flex items-center">
                    {isLast ? (
                      <div className="flex items-center space-x-2 px-3 py-2 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20">
                        <span className="text-sm font-semibold text-primary dark:text-primary">
                          {title}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Link
                          href={path}
                          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <span className="text-sm font-medium">{title}</span>
                        </Link>
                        <ChevronRight size={16} className="text-gray-400 ml-2" />
                      </>
                    )}
                  </div>
                );
              })}
            </>
          )}

        </div>
      </nav>
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US')}
            </time>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-00 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className="">
          <BlogContentWrapper htmlContent={htmlContent.toString()} />
        </div>
        {subcontents.length > 0 && (
          <nav className="mt-8">
            <ul className="space-y-4">
              {subcontents.map(sub => (
                <li key={sub.title}>
                  <Link
                    href={`/${lang}/projects/${[...slugArr, sub.slug].join('/')}`}
                    className="block bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 border border-gray-100 dark:border-gray-800 group hover:bg-primary/10 dark:hover:bg-primary/20"
                  >
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors duration-200">
                      {sub.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </BlogPageLayout>
  );
} 