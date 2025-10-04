# Sincronização com Notion + Geração Multilíngue

Este sistema permite sincronizar conteúdo do Notion e gerar automaticamente arquivos markdown multilíngues para o blog.

## 🚀 Como Funciona

### Fluxo Completo:
1. **Busca conteúdo do Notion** via API
2. **Gera frontmatter YAML** com metadados multilíngues
3. **Traduz automaticamente** título, excerpt e conteúdo
4. **Cria arquivos separados** para cada idioma (`.pt.md` e `.en.md`)

### Estrutura dos Arquivos:
```
src/content/blog/
├── meu-post.md        # Versão em português (original)
└── outro-post.md      # Outro post em português

src/app/[lang]/content/blog/translated/
├── meu-post.en.md     # Versão traduzida em inglês
└── outro-post.en.md   # Outro post traduzido em inglês
```

## 📋 Pré-requisitos

1. **Variáveis de ambiente** no `.env`:
```env
NOTION_API_KEY=sua_chave_api_notion
NOTION_DATABASE_ID=id_do_seu_database
```

2. **Dependências** instaladas:
```bash
npm install @notionhq/client dotenv
```

## 🔧 Como Usar

### 1. Sincronizar com Notion
```bash
# Sincronização completa com tradução
npm run sync-notion

# Sincronização sem tradução (para testes)
npm run sync-notion -- --skip-translation

# Ou diretamente
node src/scripts/sync-notion.ts --skip-translation
```

### 2. Testar o Sistema
```bash
node test-notion-sync.js
```

## 📝 Estrutura do Frontmatter

Cada arquivo gerado terá um frontmatter como este:

```yaml
---
title: 
  pt: "Título em Português"
  en: "Title in English"
slug: "meu-post"
date: "2024-01-15"
tags: ["tag1", "tag2"]
excerpt:
  pt: "Resumo em português..."
  en: "Summary in English..."
---

Conteúdo do post em Markdown...
```

## 🌍 Tradução Automática

O sistema usa **múltiplas APIs gratuitas** como fallback para traduzir:
- ✅ **LibreTranslate** (principal)
- ✅ **MyMemory** (backup)
- ✅ **Lingva Translate** (backup)

**Traduz automaticamente:**
- Títulos
- Excerpts  
- Conteúdo completo

**Modo Teste (sem tradução):**
```bash
npm run sync-notion -- --skip-translation
```

**Nota:** A tradução automática pode não ser perfeita. Para melhor qualidade, considere:
- Revisar e editar as traduções manualmente
- Usar APIs pagas (Google Translate, DeepL)
- Traduzir manualmente o conteúdo

## 🔄 Atualizações

Para atualizar posts existentes:
1. Modifique o conteúdo no Notion
2. Execute `npm run sync-notion` novamente
3. Os arquivos serão sobrescritos com o novo conteúdo

## 🛠️ Personalização

### Mudar API de Tradução
Edite a função `translateText()` em `src/scripts/sync-notion.ts`:

```typescript
// Para Google Translate (requer API key)
const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
  method: 'POST',
  body: JSON.stringify({
    q: text,
    source: fromLang,
    target: toLang
  })
});
```

### Adicionar Mais Idiomas
1. Modifique a função `generateBlogFiles()` para gerar arquivos `.es.md`, `.fr.md`, etc.
2. Atualize o parser em `src/app/[lang]/blog/[slug]/page.tsx` para suportar os novos idiomas

## 🐛 Solução de Problemas

### Erro de API do Notion
- Verifique se `NOTION_API_KEY` está correto
- Confirme se `NOTION_DATABASE_ID` é válido
- Verifique as permissões da API key

### Erro de Tradução
- O sistema tenta 3 APIs diferentes automaticamente
- Se todas falharem, usa o texto original como fallback
- Para testes rápidos, use: `npm run sync-notion -- --skip-translation`
- Considere usar APIs pagas para melhor qualidade

### Arquivos Não Gerados
- Verifique se há posts no database do Notion
- Confirme se os posts têm título
- Verifique os logs do console para erros específicos

## 📚 Próximos Passos

1. **Configurar webhook** para sincronização automática
2. **Adicionar mais idiomas** (espanhol, francês, etc.)
3. **Implementar cache** para evitar traduções desnecessárias
4. **Adicionar validação** de conteúdo
5. **Criar interface web** para gerenciar posts

## 🤝 Contribuição

Para melhorar o sistema:
1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente as melhorias
4. Abra um Pull Request

---

**Dúvidas?** Abra uma issue no repositório! 