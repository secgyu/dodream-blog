"use client";

interface HtmlRendererProps {
  content: string;
}

export function HtmlRenderer({ content }: HtmlRendererProps) {
  return (
    <>
      <style jsx global>{`
        .html-content h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: var(--foreground);
        }
        .html-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }
        .html-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .html-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
          color: var(--foreground);
        }
        .html-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .html-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .html-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
          color: var(--foreground);
        }
        .html-content li > p {
          margin: 0;
          display: inline;
        }
        .html-content blockquote {
          border-left: 4px solid var(--border);
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: var(--muted-foreground);
        }
        .html-content pre {
          background-color: var(--muted);
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .html-content code {
          background-color: var(--muted);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: monospace;
        }
        .html-content pre code {
          background: none;
          padding: 0;
        }
        .html-content a {
          color: var(--primary);
          text-decoration: none;
        }
        .html-content a:hover {
          text-decoration: underline;
        }
        .html-content hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2rem 0;
        }
        .html-content strong {
          font-weight: 600;
        }
        .html-content em {
          font-style: italic;
        }
      `}</style>
      <div className="html-content" dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}
