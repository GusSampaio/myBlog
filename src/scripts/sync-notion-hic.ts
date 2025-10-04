// sync-notion-from-database.ts
import { Client } from '@notionhq/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fetch from 'node-fetch';
import { tmpdir } from 'os';
import { writeFile as writeTempFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { table } from 'console';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;
const OUTPUT_DIR = join(process.cwd(), 'src', 'content', 'blog');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadImageToCloudinary(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    const tempPath = `${tmpdir()}/${randomUUID()}.jpg`;
    await writeTempFile(tempPath, buffer);

    const result = await cloudinary.uploader.upload(tempPath);
    return result.secure_url;
  } catch (error) {
    console.error('Erro ao fazer upload no Cloudinary:', error);
    return null;
  }
}

// Função para processar blocos recursivamente (usado para toggles e outros blocos aninhados)
async function processBlocksRecursively(blocks: any[], pageSlug: string, parentIndex: number = 0): Promise<string> {
  let content = '';
  let imageIndex = 0;
  let toggleIndex = 0;

  for (const block of blocks) {
    const b = block as any;
    
    // Tratamento de imagens
    if (b.type === 'image') {
      const image = b.image;
      let imageUrl = '';
      let caption = image.caption?.[0]?.plain_text || 'Imagem';
      
      if (image.type === 'external') {
        imageUrl = image.external.url;
      } else if (image.type === 'file') {
        imageUrl = image.file.url;
      }
      
      if (imageUrl) {
        const cloudinaryUrl = await uploadImageToCloudinary(imageUrl);
        if (cloudinaryUrl) {
          content += `![${caption}](${cloudinaryUrl})\n\n`;
          imageIndex++;
        }
        continue;
      }
      
      continue;
    }
    
    // Tratamento de toggles aninhados
    if (b.type === 'toggle') {
      const toggle = b.toggle;
      const toggleText = toggle.rich_text.map((t: any) => {
        if (t.type === 'equation' && t.equation && t.equation.expression) {
          return `$${t.equation.expression}$`;
        }
        if (t.type === 'text' && t.text.link) {
          return `[${t.plain_text}](${t.text.link.url})`;
        }
        if (t.type === 'text') {
          return t.plain_text;
        }
        return '';
      }).join('');
      
      toggleIndex++;
      
      // Processa o conteúdo do toggle recursivamente
      let toggleContent = '';
      if (b.has_children) {
        const childBlocks = await notion.blocks.children.list({ block_id: b.id });
        toggleContent = await processBlocksRecursively(childBlocks.results, pageSlug, toggleIndex);
      }
      
      // Gera markdown especial para o toggle, preservando estrutura dos filhos
      content += `<details>\n <summary>\n ${toggleText} </summary>\n\n${toggleContent}</details>`;
      continue;
    }
    
    // Tratamento de equações
    if (b.type === 'equation' && b.equation && b.equation.expression) {
      content += `\n\n$$\n${b.equation.expression}\n$$\n\n`;
      continue;
    }
    
    // Tratamento de parágrafos
    if (b.type === 'paragraph') {
      const parts = b.paragraph.rich_text.map((t: any) => {
        if (t.type === 'equation' && t.equation && t.equation.expression) {
          return `$${t.equation.expression}$`;
        }
        if (t.type === 'text' && t.text.link) {
          return `[${t.plain_text}](${t.text.link.url})`;
        }
        if (t.type === 'text') {
          return t.plain_text;
        }
        return '';
      });
      content += parts.join('') + '\n\n';
      continue;
    }
    
    // Tratamento de headings
    if (b.type === 'heading_1') {
      const parts = b.heading_1.rich_text.map((t: any) => {
        if (t.type === 'text' && t.text.link) {
          return `[${t.plain_text}](${t.text.link.url})`;
        }
        return t.plain_text;
      });
      content += '# ' + parts.join('') + '\n\n';
      continue;
    }
    if (b.type === 'heading_2') {
      const parts = b.heading_2.rich_text.map((t: any) => {
        if (t.type === 'text' && t.text.link) {
          return `[${t.plain_text}](${t.text.link.url})`;
        }
        return t.plain_text;
      });
      content += '## ' + parts.join('') + '\n\n';
      continue;
    }
    if (b.type === 'heading_3') {
      const parts = b.heading_3.rich_text.map((t: any) => {
        if (t.type === 'text' && t.text.link) {
          return `[${t.plain_text}](${t.text.link.url})`;
        }
        return t.plain_text;
      });
      content += '### ' + parts.join('') + '\n\n';
      continue;
    }
    
    // Tratamento de listas
    if (b.type === 'bulleted_list_item') {
      const parts = b.bulleted_list_item.rich_text.map((t: any) => {
        if (t.type === 'equation' && t.equation && t.equation.expression) {
          return `$${t.equation.expression}$`;
        }
        if (t.type === 'text' && t.text.link) {
          return `[${t.plain_text}](${t.text.link.url})`;
        }
        if (t.type === 'text') {
          return t.plain_text;
        }
        return '';
      });
      content += '- ' + parts.join('') + '\n\n';
      continue;
    }
    if (b.type === 'numbered_list_item') {
      const parts = b.numbered_list_item.rich_text.map((t: any) => {
        if (t.type === 'equation' && t.equation && t.equation.expression) {
          return `$${t.equation.expression}$`;
        }
        if (t.type === 'text' && t.text.link) {
          return `[${t.plain_text}](${t.text.link.url})`;
        }
        if (t.type === 'text') {
          return t.plain_text;
        }
        return '';
      });
      content += '1. ' + parts.join('') + '\n\n';
      continue;
    }
    
    // Tratamento de code blocks
    if (b.type === 'code') {
      const code = b.code;
      const language = code.language || '';
      const codeContent = code.rich_text.map((t: any) => t.plain_text).join('');
      content += `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n\n`;
      continue;
    }
    
    // Tratamento de quote blocks
    if (b.type === 'quote') {
      const quote = b.quote.rich_text.map((t: any) => {
        if (t.type === 'text' && t.text.link) {
          return `[${t.plain_text}](${t.text.link.url})`;
        }
        return t.plain_text;
      }).join('');
      content += `\n> ${quote}\n\n`;
      continue;
    }
  }

  return content;
}

async function getBlocksRecursive(pageId: string, path: string[], pageSlug: string): Promise<{ content: string, children: Record<string, any> }> {
  const blocks = [];
  let cursor: string | undefined = undefined;
  const children: Record<string, any> = {};
  let imageIndex = 0;
  let toggleIndex = 0;

  do {
    const res = await notion.blocks.children.list({ block_id: pageId, start_cursor: cursor });
    for (const block of res.results) {
      const b = block as any;
      if (b.type === 'child_page') {
        const child = await processPage(b.id, path); 
        children[child.slug] = child;
      }
    }
    blocks.push(...res.results);
    cursor = (res as any).next_cursor || undefined;
  } while (cursor);

  let content = blocks
    .map(async (block) => {
      const b = block as any;
      
      // Tratamento de imagens
      if (b.type === 'image') {
        const image = b.image;
        let imageUrl = '';
        let caption = image.caption?.[0]?.plain_text || 'Imagem';
        
        if (image.type === 'external') {
          imageUrl = image.external.url;
        } else if (image.type === 'file') {
          imageUrl = image.file.url;
        }
        
        if (imageUrl) {
          const cloudinaryUrl = await uploadImageToCloudinary(imageUrl);
          if (cloudinaryUrl) {
            return `![${caption}](${cloudinaryUrl})\n\n`;
          }
        }
        
        return '';
      }
      
      // Tratamento de toggles
      if (b.type === 'toggle') {
        const toggle = b.toggle;
        const toggleText = toggle.rich_text.map((t: any) => {
          if (t.type === 'equation' && t.equation && t.equation.expression) {
            return `$${t.equation.expression}$`;
          }
          if (t.type === 'text' && t.text.link) {
            return `[${t.plain_text}](${t.text.link.url})`;
          }
          if (t.type === 'text') {
            return t.plain_text;
          }
          return '';
        }).join('');

        toggleIndex++;
        
        // Processa o conteúdo do toggle recursivamente
        let toggleContent = '';
        if (b.has_children) {
          const childBlocks = await notion.blocks.children.list({ block_id: b.id });
          toggleContent = await processBlocksRecursively(childBlocks.results, pageSlug, toggleIndex);
        }
        
        // Retorna um formato especial que pode ser processado pelo Next.js
        return `<details >\n <summary> ${toggleText} </summary>\n\n${toggleContent}</details>`;
      }
      
      // Tratamento de equações
      if (b.type === 'equation' && b.equation && b.equation.expression) {
        // Bloco de equação do Notion vira LaTeX inline
        return `\n\n$$\n${b.equation.expression}\n$$\n\n`;
      }
      
      // Tratamento de parágrafos
      if (b.type === 'paragraph') {
        // Parágrafo pode conter rich_text do tipo equation (inline)
        const parts = b.paragraph.rich_text.map((t: any) => {
          if (t.type === 'equation' && t.equation && t.equation.expression) {
            return `$${t.equation.expression}$`;
          }
          // Tratamento de links
          if (t.type === 'text' && t.text.link) {
            return `[${t.plain_text}](${t.text.link.url})`;
          }
          // Só inclui plain_text se NÃO for equation
          if (t.type === 'text') {
            return t.plain_text;
          }
          return '';
        });
        return parts.join('');
      }
      
      // Tratamento de headings
      if (b.type === 'heading_1') {
        const parts = b.heading_1.rich_text.map((t: any) => {
          if (t.type === 'text' && t.text.link) {
            return `[${t.plain_text}](${t.text.link.url})`;
          }
          return t.plain_text;
        });
        return '# ' + parts.join('');
      }
      if (b.type === 'heading_2') {
        const parts = b.heading_2.rich_text.map((t: any) => {
          if (t.type === 'text' && t.text.link) {
            return `[${t.plain_text}](${t.text.link.url})`;
          }
          return t.plain_text;
        });
        return '## ' + parts.join('');
      }
      if (b.type === 'heading_3') {
        const parts = b.heading_3.rich_text.map((t: any) => {
          if (t.type === 'text' && t.text.link) {
            return `[${t.plain_text}](${t.text.link.url})`;
          }
          return t.plain_text;
        });
        return '### ' + parts.join('');
      }
      
      // Tratamento de listas
      if (b.type === 'bulleted_list_item') {
        const parts = b.bulleted_list_item.rich_text.map((t: any) => {
          if (t.type === 'equation' && t.equation && t.equation.expression) {
            return `$${t.equation.expression}$`;
          }
          if (t.type === 'text' && t.text.link) {
            return `[${t.plain_text}](${t.text.link.url})`;
          }
          if (t.type === 'text') {
            return t.plain_text;
          }
          return '';
        });
        return '- ' + parts.join('');
      }
      if (b.type === 'numbered_list_item') {
        const parts = b.numbered_list_item.rich_text.map((t: any) => {
          if (t.type === 'equation' && t.equation && t.equation.expression) {
            return `$${t.equation.expression}$`;
          }
          if (t.type === 'text' && t.text.link) {
            return `[${t.plain_text}](${t.text.link.url})`;
          }
          if (t.type === 'text') {
            return t.plain_text;
          }
          return '';
        });
        return '1. ' + parts.join('');
      }
      
      // Tratamento de code blocks
      if (b.type === 'code') {
        const code = b.code;
        const language = code.language || '';
        const codeContent = code.rich_text.map((t: any) => t.plain_text).join('');
        return `\n\`\`\`${language}\n${codeContent}\n\`\`\`\n\n`;
      }
      
      // Tratamento de quote blocks
      if (b.type === 'quote') {
        const quote = b.quote.rich_text.map((t: any) => {
          if (t.type === 'text' && t.text.link) {
            return `[${t.plain_text}](${t.text.link.url})`;
          }
          return t.plain_text;
        }).join('');
        return `\n> ${quote}\n\n`;
      }
      
      if (b.type === 'table') {
        const hasColumnHeader = b.table.has_column_header;
        const tableRows = await notion.blocks.children.list({ block_id: b.id });
        let tableMd = '';
        tableMd += `<table class="custom-table">\n`

        for (let i = 0; i < tableRows.results.length; i++) {
          const row = tableRows.results[i];
          if (row.type === 'table_row') {
            const cells = row.table_row.cells.map((cell: any[]) =>
              cell.map((t: any) => t.plain_text).join('')
            );
        
            if (i === 0 && hasColumnHeader) {
              tableMd += ` <thead>\n  <tr>\n`;
              tableMd += `   <th>${cells.join('</th>\n   <th>')}</th>\n`;
              tableMd += `  </tr>\n </thead>\n`;
            } else {
              if ((i === 0 && !hasColumnHeader) || (i === 1 && hasColumnHeader)) {
                tableMd += ` <tbody>\n`;
              }
              tableMd += `  <tr>\n`;
              tableMd += `   <td>${cells.join('</td>\n   <td>')}</td>\n`;
              tableMd += `  </tr>\n`;
            }
          }
        }
        tableMd += `</tbody>\n</table>`;
        
        console.log(tableMd);
        return `\n${tableMd}\n\n`;
      }
      

      return '';
    })
    .filter(Boolean);

  // Aguarda todas as operações assíncronas (download de imagens)
  const resolvedContent = await Promise.all(content);
  
  let finalContent = resolvedContent.join('\n\n');

  // Garante que blocos LaTeX consecutivos sejam separados corretamente
  finalContent = finalContent.replace(/\$\s*([^$]+)\s*\$\s*\n+\s*\$\s*([^$]+)\s*\$/g, '$\n$1\n$\n\n$\n$2\n$');

  return { content: finalContent, children };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

async function processPage(pageId: string, path: string[] = []): Promise<any> {
  const page = await notion.pages.retrieve({ page_id: pageId }) as any;
  const titleProp = Object.values(page.properties).find((p: any) => p.type === 'title') as any;
  const title = titleProp?.title?.[0]?.plain_text || 'sem-titulo';
  const slug = slugify(title);
  const fullPath = [...path, slug];

  let cover = '';
  if (page.cover) { 
    if (page.cover.type === 'external') {
      cover = page.cover.external.url;
    } else if (page.cover.type === 'file') {
      cover = page.cover.file.url;
    }
  }

  const { content, children } = await getBlocksRecursive(pageId, fullPath, slug);

  // O excerpt deve ser apenas a primeira sentença de texto da página
  const firstSentenceMatch = content.match(/[^.!?\n]+[.!?]/);
  const excerpt = firstSentenceMatch ? firstSentenceMatch[0].trim() : content.slice(0, 200).replace(/\s+\S*$/, '') + '...';

  const frontmatter = `---\ntitle: "${title}"\nslug: "${slug}"\ndate: "${new Date().toISOString().split('T')[0]}"\ntags: []\nexcerpt: "${excerpt}"\ncover: "${cover ? cover.trim() : ''}"\n---`;

  const dir = join(OUTPUT_DIR, ...fullPath);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.pt.md'), `${frontmatter}\n\n${content}`,'utf8');

  return { title, slug, path: fullPath, children };
}

async function main() {
  console.log('🚀 Sincronizando Notion a partir de um database...');
  const res = await notion.databases.query({ database_id: DATABASE_ID, page_size: 100 });
  for (const result of res.results) {
    await processPage(result.id);
  }
  console.log('✅ Sincronização completa.');
}

main().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});