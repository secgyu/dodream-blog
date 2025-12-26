import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import { BlogHeader } from "@/components/blog-header";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "포스트를 찾을 수 없습니다" };
  }

  return {
    title: `${post.title} | Do x Dream`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <BlogHeader />

      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* 뒤로가기 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>

        <article>
          {/* 헤더 */}
          <header className="mb-10">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-primary font-medium">{post.category}</span>
              {post.subCategory && (
                <>
                  <span>·</span>
                  <span>{post.subCategory}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl font-bold leading-tight text-foreground mb-4">{post.title}</h1>

            <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6">
              <span>{post.author}</span>
              <span>·</span>
              <time>{post.date}</time>
            </div>
          </header>

          {/* 본문 */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <PostContent content={post.content} />
          </div>

          {/* 태그 */}
          <footer className="mt-12 pt-6 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        </article>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <p className="text-sm text-muted-foreground">© 2025 Do x Dream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function PostContent({ content }: { content: string }) {
  // 마크다운 스타일 콘텐츠를 간단히 렌더링
  const lines = content.trim().split("\n");

  return (
    <div className="space-y-4">
      {lines.map((line, index) => {
        const trimmedLine = line.trim();

        // 빈 줄
        if (!trimmedLine) {
          return null;
        }

        // 헤딩 h2
        if (trimmedLine.startsWith("## ")) {
          return (
            <h2 key={index} className="text-2xl font-semibold mt-10 mb-4 text-foreground">
              {trimmedLine.slice(3)}
            </h2>
          );
        }

        // 헤딩 h3
        if (trimmedLine.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xl font-semibold mt-8 mb-3 text-foreground">
              {trimmedLine.slice(4)}
            </h3>
          );
        }

        // 코드 블록 시작/끝
        if (trimmedLine.startsWith("```")) {
          return null; // 코드 블록은 별도 처리 필요
        }

        // 리스트 아이템
        if (trimmedLine.startsWith("- ")) {
          return (
            <li key={index} className="ml-4 text-muted-foreground">
              {formatInlineCode(trimmedLine.slice(2))}
            </li>
          );
        }

        // 숫자 리스트
        if (/^\d+\.\s/.test(trimmedLine)) {
          return (
            <li key={index} className="ml-4 text-muted-foreground list-decimal">
              {formatInlineCode(trimmedLine.replace(/^\d+\.\s/, ""))}
            </li>
          );
        }

        // 테이블 (간단히 스킵)
        if (trimmedLine.startsWith("|")) {
          return null;
        }

        // 일반 텍스트
        return (
          <p key={index} className="text-muted-foreground leading-relaxed">
            {formatInlineCode(trimmedLine)}
          </p>
        );
      })}
    </div>
  );
}

function formatInlineCode(text: string): React.ReactNode {
  // **bold** 처리
  const parts = text.split(/(\*\*[^*]+\*\*|\`[^`]+\`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
