"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { BlogHeader } from "@/components/blog-header";
import { TagInput } from "@/components/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { CATEGORIES, SUB_CATEGORIES } from "@/lib/constants";

const NovelEditor = dynamic(() => import("@/components/novel-editor").then((mod) => mod.NovelEditor), {
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] w-full border border-border rounded-lg bg-card flex items-center justify-center">
      <p className="text-muted-foreground">에디터 로딩중...</p>
    </div>
  ),
});

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function WritePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const { data: existingTags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: api.posts.getTags,
  });

  const createPostMutation = useMutation({
    mutationFn: api.posts.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/");
    },
    onError: (error) => {
      alert(`글 저장에 실패했습니다: ${error.message}`);
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.name && !author) {
      setAuthor(user.name);
    }
  }, [user, author]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSubCategory("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = generateSlug(title) + "-" + Date.now().toString(36);
    const excerpt =
      content
        .slice(0, 200)
        .replace(/[#*`\n]/g, "")
        .trim() + "...";

    createPostMutation.mutate({
      slug,
      title,
      excerpt,
      content,
      author,
      category,
      subCategory: subCategory || undefined,
      tags,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const availableSubCategories = category ? SUB_CATEGORIES[category] || [] : [];

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-medium text-foreground mb-8">새 글 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="글 제목을 입력하세요"
              className="text-lg h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">작성자</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="작성자 이름"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>카테고리</Label>
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? "default" : "outline"}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {availableSubCategories.length > 0 && (
              <div className="space-y-2">
                <Label>세부 분류</Label>
                <div className="flex gap-2">
                  {availableSubCategories.map((sub) => (
                    <Button
                      key={sub}
                      type="button"
                      variant={subCategory === sub ? "default" : "outline"}
                      onClick={() => setSubCategory(sub)}
                    >
                      {sub}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              기술 태그 <span className="text-xs text-muted-foreground">(엔터 또는 쉼표로 추가)</span>
            </Label>
            <TagInput tags={tags} onTagsChange={setTags} suggestions={existingTags} />
          </div>

          <div className="space-y-2">
            <Label>본문</Label>
            <p className="text-xs text-muted-foreground mb-2">
              노션처럼 작성하세요: <code className="bg-muted px-1 rounded">/</code> 명령어,{" "}
              <code className="bg-muted px-1 rounded">-</code> 리스트, <code className="bg-muted px-1 rounded">##</code>{" "}
              헤딩
            </p>
            <NovelEditor onChange={setContent} />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              취소
            </Button>
            <Button type="submit" disabled={createPostMutation.isPending || !category || !title || !author || !content}>
              {createPostMutation.isPending ? "저장 중..." : "발행하기"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
