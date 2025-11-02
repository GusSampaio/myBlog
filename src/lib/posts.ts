import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';

interface BlogPost {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
}

export function parseYamlFrontmatter(frontmatter: string): any {
    const metadata: any = {};
    const lines = frontmatter.split('\n');
    let currentKey = '';
    let currentValue: any = null;
    let isInObject = false;
    let objectIndent = 0;
    let isInContent = false;
    let contentLang = '';
    let contentBuffer = '';
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      const indent = line.length - line.trimStart().length;
      
      if (!trimmedLine) continue;
  
      // Verificar se estamos entrando no campo content
      if (trimmedLine === 'content:' && !isInContent) {
        isInContent = true;
        currentValue = {};
        metadata.content = currentValue;
        objectIndent = indent;
        continue;
      }
  
      // Se estamos dentro do content, processar as línguas
      if (isInContent && indent > objectIndent) {
        // Verificar se é uma nova língua (pt: ou en:) - deve estar no início da linha
        const langMatch = trimmedLine.match(/^([a-z]{2}):\s*(.*)$/);
        if (langMatch) {
          // Salvar conteúdo anterior se existir
          if (contentLang && contentBuffer) {
            currentValue[contentLang] = contentBuffer.trim();
            contentBuffer = '';
          }
          
          contentLang = langMatch[1];
          // Se há conteúdo na mesma linha, adicionar ao buffer
          if (langMatch[2]) {
            contentBuffer = langMatch[2];
          }
        } else {
          // Continuar acumulando conteúdo da língua atual
          if (contentLang) {
            // Remover a indentação extra para manter o Markdown correto
            const contentLine = line.substring(objectIndent + 2); // +2 para a indentação do idioma
            contentBuffer += '\n' + contentLine;
          }
        }
        continue;
      }
  
      // Se saímos do content, salvar última língua
      if (isInContent && indent <= objectIndent && trimmedLine) {
        if (contentLang && contentBuffer) {
          currentValue[contentLang] = contentBuffer.trim();
        }
        isInContent = false;
        contentLang = '';
        contentBuffer = '';
      }
  
      // Verificar se é uma chave que inicia um objeto (title:, excerpt:, etc.)
      const objectMatch = trimmedLine.match(/^([^:]+):\s*$/);
      if (objectMatch && !isInContent) {
        currentKey = objectMatch[1].trim();
        currentValue = {};
        isInObject = true;
        objectIndent = indent;
        metadata[currentKey] = currentValue;
        continue;
      }
  
      // Se estamos dentro de um objeto (title, excerpt, etc.), processar as línguas
      if (isInObject && currentValue && typeof currentValue === 'object' && !isInContent) {
        // Se a indentação voltou ao nível original, sair do objeto
        if (indent <= objectIndent && trimmedLine) {
          isInObject = false;
          continue;
        }
  
        // Processar linha do objeto - deve estar no início da linha
        const nestedMatch = trimmedLine.match(/^([a-z]{2}):\s*(.*)$/);
        if (nestedMatch) {
          const [, nestedKey, nestedValue] = nestedMatch;
          try {
            currentValue[nestedKey.trim()] = JSON.parse(nestedValue);
          } catch {
            currentValue[nestedKey.trim()] = nestedValue.replace(/^"|"$/g, '');
          }
        }
      }
  
      // Verificar se é uma chave simples (key: value) - deve estar no início da linha
      const simpleMatch = trimmedLine.match(/^([^:]+):\s*(.*)$/);
      if (simpleMatch && !isInObject && !isInContent) {
        const [, key, value] = simpleMatch;
        currentKey = key.trim();
        
        // Tentar fazer parse do valor
        try {
          currentValue = JSON.parse(value);
        } catch {
          currentValue = value.replace(/^"|"$/g, '');
        }
        
        metadata[currentKey] = currentValue;
        continue;
      }
    }
  
    // Salvar última língua do content se ainda não foi salva
    if (isInContent && contentLang && contentBuffer) {
      currentValue[contentLang] = contentBuffer.trim();
    }
  
    return metadata;
}

