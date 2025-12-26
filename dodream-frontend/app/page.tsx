import { BlogHeader } from "@/components/blog-header";
import { PostList } from "@/components/post-list";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <BlogHeader />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <PostList />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <p className="text-sm text-muted-foreground">© 2025 Do x Dream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
