'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface BlogPageLayoutProps {
  htmlContent: string;
  children?: React.ReactNode;
  subpages?: { slug: string; title: string }[];
}

export default function BlogPageLayout({ htmlContent, children }: BlogPageLayoutProps) {
  const [headings, setHeadings] = useState<{ id: string, text: string, level: number }[]>([]);
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleHeadingsExtracted = (event: CustomEvent) => {
      setHeadings(event.detail);
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }, 0);
    };
    window.addEventListener('headingsExtracted', handleHeadingsExtracted as EventListener);
    return () => {
      window.removeEventListener('headingsExtracted', handleHeadingsExtracted as EventListener);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="container mx-auto py-12 px-6">
        <div className="max-w-8xl mx-auto flex gap-8 items-start">
          {/* Conteúdo principal - Card maior */}
          <div className="flex-1 min-w-0">
            <div className="max-w-8xl mx-auto">
              {children}
            </div>
          </div>
          {/* Menu lateral */}
          {headings.length > 0 && (
            <div className="w-[240px] flex-shrink-0">
              <div
                className={`flex flex-col items-stretch ${expanded ? 'fixed w-[240px] z-40' : 'fixed w-[240px] z-40 '
                  }`}
              >
                <button
                  className={`w-full flex items-center justify-between px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 border border-gray-300 text-gray-900 dark:text-gray-100 font-semibold bg-background ${expanded ? 'rounded-t-xl' : 'rounded-xl'} shadow-lg hover:shadow-xl text-lg`}
                  style={{ minHeight: 56 }}
                  onClick={() => setExpanded((v) => !v)}
                  aria-expanded={expanded}
                  aria-controls="sidebar-nav-list"
                >
                  Navegação
                  <span className="ml-3">
                    {expanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                  </span>
                </button>

                <div
                  id="sidebar-nav-list"
                  ref={listRef}
                  className={`transition-all duration-300 bg-background border-x border-b border-gray-300 shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 ${expanded ? 'rounded-b-xl' : 'border-transparent'}`}
                  style={{
                    maxHeight: expanded ? 500 : 0,
                    opacity: expanded ? 1 : 0,
                  }}
                >
                  <nav className="px-6 py-4">
                    <ul className="space-y-2">
                      {headings.map((h) => (
                        <li key={h.id} style={{ marginLeft: (h.level - 2) * 16 }}>
                          <a
                            href={`#${h.id}`}
                            className={`block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 ${h.level === 2 ? 'text-base font-semibold' : h.level === 3 ? 'text-sm font-medium' : 'text-sm'}`}
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 