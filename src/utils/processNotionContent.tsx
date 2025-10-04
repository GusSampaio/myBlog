import React from 'react';

interface ProcessNotionContentProps {
  content: string;
}

export function processNotionContent({ content }: ProcessNotionContentProps) {
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;


  // Se não há toggles, retorna o conteúdo original
  if (parts.length === 0) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return <>{parts}</>;
}

// Função para processar markdown simples (sem toggles)
export function processSimpleMarkdown(content: string) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
} 