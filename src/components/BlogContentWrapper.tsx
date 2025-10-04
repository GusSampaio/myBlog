'use client';

import { useEffect, useState } from 'react';
import BlogContentWithSidebar from './BlogContentWithSidebar';
import BlogContent from './BlogContent';

interface BlogContentWrapperProps {
  htmlContent: string;
}

export default function BlogContentWrapper({ htmlContent }: BlogContentWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Renderiza o conteúdo básico primeiro (server-side)
  if (!isClient) {
    return <BlogContent htmlContent={htmlContent} />;
  }

  // Depois de hidratado, renderiza com o sidebar (client-side)
  return <BlogContentWithSidebar htmlContent={htmlContent} />;
} 