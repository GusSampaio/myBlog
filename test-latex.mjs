import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

const testMarkdown = `
Inline: $x^2 + y^2 = z^2$

Bloco:
$$
\\int_0^1 x^2 dx
$$
`;

const file = await unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeStringify)
  .process(testMarkdown);

console.log(String(file));