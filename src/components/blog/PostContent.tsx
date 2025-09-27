'use client'
import React, { useState, useEffect } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeReact from 'rehype-react';
import rehypeSlug from 'rehype-slug';
import { visit } from 'unist-util-visit';
import type { Root as HastRoot } from 'hast';
import type { Root as MdastRoot, Code as MdastCode } from 'mdast';
import { getHighlighter, type Highlighter } from 'shiki';

import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockCopyButton,
  CodeBlockFiles,
  CodeBlockFilename,
  type BundledLanguage,
} from "@/components/ui/shadcn-io/code-block"

let highlighter: Highlighter | undefined;
const getShikiHighlighter = async () => {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['javascript', 'typescript', 'python', 'bash', 'json'],
    });
  }
  return highlighter;
};

const ClientSyntaxHighlighter = ({ code, lang }: { code: string, lang: BundledLanguage }) => {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const highlight = async () => {
      try {
        const shikiHighlighter = await getShikiHighlighter();
        const highlightedCode = shikiHighlighter.codeToHtml(code, { 
          lang, 
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          }
        });
        setHtml(highlightedCode);
      } catch (error) {
        console.error('Shiki initialization error:', error);
        setHtml(`<pre><code>${code.replace(/</g, '<').replace(/>/g, '>')}</code></pre>`);
      }
    };
    highlight();
  }, [code, lang]);

  return <div dangerouslySetInnerHTML={{ __html: html }} className="shiki-container" />;
};


const remarkExtractFilename = () => {
  return (tree: MdastRoot) => {
    visit(tree, 'code', (node: MdastCode) => {
      if (node.lang && node.lang.includes(':')) {
        const [lang, filename] = node.lang.split(':');
        node.lang = lang;
        node.meta = filename;
      }
    });
  };
};

const rehypeFilenameToPre = () => {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'code' && node.data?.meta) {
        if (parent && parent.type === 'element' && parent.tagName === 'pre') {
          parent.properties = parent.properties || {};
          parent.properties['data-meta'] = node.data.meta as string;
        }
      }
    });
  };
};

// Helper function to extract text content from React children
const getTextContent = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props && props.children) {
      return getTextContent(props.children);
    }
  }
  if (Array.isArray(children)) {
    return children.map(getTextContent).join('');
  }
  return '';
};

const PostContent = ({ content }: { content: string }) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkExtractFilename)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeFilenameToPre)
    // Using `as any` here is a temporary workaround for a complex type
    // inference issue with `unified` and `rehype-react`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .use(rehypeReact as any, {
      createElement: React.createElement,
      Fragment: React.Fragment,
      components: {
        pre: (props: { children: React.ReactNode; 'data-meta'?: string; className?: string }) => {
          const child = React.Children.toArray(props.children)[0] as React.ReactElement<{
            className?: string;
            children: React.ReactNode;
          }>;
          
          const langClass = child?.props?.className?.split(' ').find(c => c.startsWith('language-'));
          const hasCodeContent = child && child.props && child.props.children;
          const isCodeBlock = hasCodeContent && langClass;

          if (isCodeBlock) {
            const language = langClass.replace(/language-/, '') as BundledLanguage;
            const filename = props['data-meta'] || '';
            const code = getTextContent(child.props.children).trim();
            
            const codeData = [{ language, code, filename }];

            return (
              <CodeBlock data={codeData} defaultValue={language} className="not-prose">
                <CodeBlockHeader>
                  <CodeBlockFiles>
                    {(item) =>
                      item.filename ? (
                        <CodeBlockFilename
                          key={item.language}
                          value={item.language}
                        >
                          {item.filename}
                        </CodeBlockFilename>
                      ) : null
                    }
                  </CodeBlockFiles>
                  <CodeBlockCopyButton />
                </CodeBlockHeader>
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem key={item.language} value={item.language}>
                      <ClientSyntaxHighlighter lang={item.language as BundledLanguage} code={item.code} />
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
            );
          }
          
          return (
            <pre 
              {...props} 
              className="bg-muted p-4 rounded-lg text-xs font-normal overflow-x-auto"
            />
          );
        },
        code: (props: { children: React.ReactNode, className?: string }) => {
          const { children, className } = props;
          if (className?.startsWith('language-')) {
            return <code {...props} className={`${className} font-normal text-xs`} />;
          }
          return (
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-normal">
              {children}
            </code>
          );
        },
      },
    });

  const contentReact = processor.processSync(content).result as React.ReactNode;

  return <div className="prose prose-lg max-w-none">{contentReact}</div>;
};

export default PostContent;