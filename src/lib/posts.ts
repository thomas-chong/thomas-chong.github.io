import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import { visit } from 'unist-util-visit';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const postsDirectory = path.join(process.cwd(), '_posts');

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as {
        date: string;
        title: string;
        description: string;
        tags: string[];
        image?: string;
      }),
      author: (matterResult.data.author || 'Anonymous') as string,
      image: ((matterResult.data.image || matterResult.data.banner) as string) || undefined,
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const toc: { level: number; text: string; slug: string }[] = [];

  // Helper function to extract text from nested nodes
  function extractTextFromNode(node: unknown): string {
    if (typeof node === 'string') return node;
    if (typeof node === 'object' && node !== null) {
      const nodeObj = node as Record<string, unknown>;
      if (nodeObj.type === 'text' && typeof nodeObj.value === 'string') {
        return nodeObj.value;
      }
      if (typeof nodeObj.value === 'string') {
        return nodeObj.value;
      }
      if (Array.isArray(nodeObj.children)) {
        return nodeObj.children.map(extractTextFromNode).join('');
      }
    }
    return '';
  }

  const processedContent = await remark()
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(() => (tree) => {
      visit(tree, 'element', (node: unknown) => {
        const elementNode = node as { 
          tagName?: string; 
          properties?: { id?: string };
          children?: unknown[];
        };
        if (elementNode.tagName === 'h1' || elementNode.tagName === 'h2' || elementNode.tagName === 'h3') {
          const text = extractTextFromNode(elementNode);
          if (text && elementNode.properties?.id) {
            toc.push({
              level: parseInt(elementNode.tagName.substring(1)),
              text: text.trim(),
              slug: elementNode.properties.id,
            });
          }
        }
      });
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(matterResult.content);
  
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    content: matterResult.content,
    toc,
    ...(matterResult.data as { date: string; title: string; author: string; banner?: string }),
  };
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      id: fileName.replace(/\.md$/, ''),
    };
  });
}