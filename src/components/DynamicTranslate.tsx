'use client';

import { useEffect, useState } from 'react';
import { useTranslate } from '@/hooks/useTranslate';
import { Button } from '@/components/ui/button';
import { Loader2, Languages } from 'lucide-react';

interface DynamicTranslateProps {
  content: string;
  from?: string;
  to?: string;
  className?: string;
}

export function DynamicTranslate({ 
  content, 
  from = 'pt', 
  to = 'en', 
  className = '' 
}: DynamicTranslateProps) {
  const { translated, isLoading, error, translate } = useTranslate();
  const [showTranslated, setShowTranslated] = useState(false);
  const [processedContent, setProcessedContent] = useState(content);

  // Preservar links e imagens durante a tradução
  const preserveLinksAndImages = (text: string) => {
    const links: string[] = [];
    let linkIndex = 0;
    
    // Substituir links e imagens por placeholders
    const textWithoutLinks = text
      // Capturar imagens: ![alt](url)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match) => {
        const placeholder = `__IMAGE_${linkIndex}__`;
        links.push(match);
        linkIndex++;
        return placeholder;
      })
      // Capturar links: [texto](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
        const placeholder = `__LINK_${linkIndex}__`;
        links.push(match);
        linkIndex++;
        return placeholder;
      });

    return { textWithoutLinks, links };
  };

  const restoreLinksAndImages = (text: string, links: string[]) => {
    let result = text;
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.startsWith('![')) {
        result = result.replace(`__IMAGE_${i}__`, link);
      } else {
        result = result.replace(`__LINK_${i}__`, link);
      }
    }
    return result;
  };

  const handleTranslate = async () => {
    if (showTranslated) {
      setShowTranslated(false);
      setProcessedContent(content);
      return;
    }

    const { textWithoutLinks, links } = preserveLinksAndImages(content);
    await translate(textWithoutLinks, from, to);
    
    if (translated) {
      const restoredContent = restoreLinksAndImages(translated, links);
      setProcessedContent(restoredContent);
      setShowTranslated(true);
    }
  };

  useEffect(() => {
    if (translated && !showTranslated) {
      const { textWithoutLinks, links } = preserveLinksAndImages(content);
      const restoredContent = restoreLinksAndImages(translated, links);
      setProcessedContent(restoredContent);
      setShowTranslated(true);
    }
  }, [translated, content, showTranslated]);

  return (
    <div className={className}>
      <div className="mb-4">
        <Button
          onClick={handleTranslate}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Languages className="h-4 w-4" />
          )}
          {showTranslated ? 'Ver Original' : 'Traduzir'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          Erro na tradução: {error}
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  );
} 