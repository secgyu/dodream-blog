"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold mt-10 mb-4 text-foreground">{children}</h1>,
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground border-b border-border pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => <h3 className="text-xl font-semibold mt-8 mb-3 text-foreground">{children}</h3>,
          h4: ({ children }) => <h4 className="text-lg font-semibold mt-6 mb-2 text-foreground">{children}</h4>,

          p: ({ children }) => <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>,

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              {children}
            </a>
          ),

          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-muted-foreground">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-border pl-4 my-4 text-muted-foreground italic">
              {children}
            </blockquote>
          ),

          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono text-foreground" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="rounded-lg overflow-x-auto mb-4 text-sm">{children}</pre>,

          hr: () => <hr className="my-8 border-border" />,

          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-border">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 text-left text-sm font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-sm text-muted-foreground">{children}</td>
          ),

          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt || ""} className="rounded-lg max-w-full h-auto my-4" />
          ),

          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
