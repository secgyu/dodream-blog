"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { BlogHeader } from "@/components/blog-header";
import { TagInput } from "@/components/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getAllTags } from "@/lib/posts";
import { CATEGORIES, SUB_CATEGORIES } from "@/lib/constants";

export default function WritePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingTags = getAllTags();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSubCategory("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      <main className="mx-auto max-w-3xl px-6 py-12">
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
            <Label htmlFor="content">본문</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={15}
              placeholder="마크다운 형식으로 작성할 수 있습니다..."
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting || !category || !title}>
              {isSubmitting ? "저장 중..." : "발행하기"}
            </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">* 데모 버전: 글이 실제로 저장되지 않습니다</p>
      </main>
    </div>
  );
}
