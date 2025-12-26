"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth-context";
import { BlogHeader } from "@/components/blog-header";
import { TagInput } from "@/components/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllTags } from "@/lib/posts";
import { CATEGORIES, SUB_CATEGORIES } from "@/lib/constants";

const NovelEditor = dynamic(() => import("@/components/novel-editor").then((mod) => mod.NovelEditor), {
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] w-full border border-border rounded-lg bg-card flex items-center justify-center">
      <p className="text-muted-foreground">에디터 로딩중...</p>
    </div>
  ),
});

export default function WritePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(user?.name || "");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingTags = getAllTags();

  useEffect(() => {
    if (!user) {
      router.push("/admin");
    }
  }, [user, router]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSubCategory("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("저장할 마크다운:", content);

    await new Promise((resolve) => setTimeout(resolve, 500));
    alert("데모 버전입니다. 글이 저장되지 않습니다.");
    router.push("/");
  };

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
            <Button type="submit" disabled={isSubmitting || !category || !title || !author}>
              {isSubmitting ? "저장 중..." : "발행하기"}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">* 데모 버전: 글이 실제로 저장되지 않습니다</p>
      </main>
    </div>
  );
}
