'use client';

import { useEffect, useState } from 'react';
import BlogContent from './BlogContent';

interface BlogContentWithSidebarProps {
  htmlContent: string;
}

export default function BlogContentWithSidebar({ htmlContent }: BlogContentWithSidebarProps) {
  // Extrai os headings do HTML para navegação
  const [headings, setHeadings] = useState<{ id: string, text: string, level: number }[]>([]);

  useEffect(() => {
    // Cria um elemento temporário para parsear o HTML
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;
    const hs = Array.from(temp.querySelectorAll('h2, h3, h4')).map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: parseInt(el.tagName.replace('H', ''), 10)
    }));
    setHeadings(hs);
    
    // Envia os headings via evento customizado
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('headingsExtracted', { detail: hs }));
    }
  }, [htmlContent]);

  return (
    <div className="w-full">
      <BlogContent htmlContent={htmlContent} />
    </div>
  );
} 