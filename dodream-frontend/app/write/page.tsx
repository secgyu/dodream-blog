"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { BlogHeader } from "@/components/blog-header";
import { X } from "lucide-react";
import { getAllTags } from "@/lib/posts";

const CATEGORIES = ["프론트엔드", "백엔드", "회고"] as const;
const SUB_CATEGORIES: Record<string, string[]> = {
  프론트엔드: ["웹", "앱"],
  백엔드: ["서버", "DB"],
};

export default function WritePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // 기존 태그들 (자동완성용)
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

  // 태그 추가
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().replace(/^#/, "");
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput("");
    setShowSuggestions(false);
    tagInputRef.current?.focus();
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 엔터 또는 쉼표로 태그 추가
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput);
      }
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  // 자동완성 필터링
  const filteredSuggestions = tagInput
    ? existingTags.filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !tags.includes(tag))
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 데모: 실제 저장 없이 홈으로 이동
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
          {/* 제목 */}
          <div>
            <label htmlFor="title" className="block text-sm text-muted-foreground mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border bg-background text-foreground text-lg focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="글 제목을 입력하세요"
            />
          </div>

          {/* 카테고리 선택 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">카테고리</label>
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      category === cat
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 서브카테고리 */}
            {availableSubCategories.length > 0 && (
              <div>
                <label className="block text-sm text-muted-foreground mb-2">세부 분류</label>
                <div className="flex gap-2">
                  {availableSubCategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSubCategory(sub)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        subCategory === sub
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 자유 태그 입력 */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              기술 태그 <span className="text-xs">(엔터 또는 쉼표로 추가, 자유롭게 입력)</span>
            </label>

            {/* 태그 표시 + 입력 영역 */}
            <div
              className="flex flex-wrap gap-2 p-3 border border-border bg-background min-h-[52px] cursor-text"
              onClick={() => tagInputRef.current?.focus()}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-sm text-foreground rounded-full"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTag(tag);
                    }}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={handleTagKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                placeholder={tags.length === 0 ? "#React, #Spring, #Docker..." : ""}
              />
            </div>

            {/* 자동완성 드롭다운 */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="mt-1 border border-border bg-background shadow-lg max-h-40 overflow-y-auto">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addTag(suggestion)}
                    className="w-full px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    #{suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* 추천 태그 (입력이 없을 때) */}
            {!tagInput && tags.length === 0 && (
              <div className="mt-3">
                <span className="text-xs text-muted-foreground mr-2">추천:</span>
                <div className="inline-flex flex-wrap gap-1">
                  {existingTags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-foreground transition-colors rounded"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 본문 */}
          <div>
            <label htmlFor="content" className="block text-sm text-muted-foreground mb-2">
              본문
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={15}
              className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
              placeholder="마크다운 형식으로 작성할 수 있습니다..."
            />
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !category || !title}
              className="px-6 py-3 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "저장 중..." : "발행하기"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">* 데모 버전: 글이 실제로 저장되지 않습니다</p>
      </main>
    </div>
  );
}
