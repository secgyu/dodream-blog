import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { BlogHeader } from "@/components/blog-header";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  subCategory: string;
  tags: string[];
  createdAt: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getAllPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dodream.dev";

  if (!post) {
    return { title: "포스트를 찾을 수 없습니다" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteUrl}/posts/${post.slug}`,
      publishedTime: post.createdAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <BlogHeader />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </Link>

        <article>
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
              <time>{formatDate(post.createdAt)}</time>
            </div>
          </header>

          <MarkdownRenderer content={post.content} />

          <footer className="mt-12 pt-6 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
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
