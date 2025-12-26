import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import { BlogHeader } from "@/components/blog-header";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Badge } from "@/components/ui/badge";

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
              <time>{post.date}</time>
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
