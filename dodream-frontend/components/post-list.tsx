"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CategorySidebar } from "./category-sidebar";
import { posts } from "@/lib/posts";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  subCategory: string; // 웹/앱 등 서브카테고리 추가
  tags: string[];
}

const subCategories: Record<string, string[]> = {
  프론트엔드: ["웹", "앱"],
  백엔드: ["서버", "DB"],
};

const POSTS_PER_PAGE = 5;

export function PostList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    if (activeCategory && post.category !== activeCategory) return false;
    if (activeSubCategory && post.subCategory !== activeSubCategory) return false;
    if (activeTag && !post.tags.includes(activeTag)) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
    setActiveSubCategory(null);
    setActiveTag(null);
    setCurrentPage(1);
  };

  const handleSubCategoryChange = (subCategory: string | null) => {
    setActiveSubCategory(subCategory);
    setActiveTag(null);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
    setCurrentPage(1);
  };

  const clearTagFilter = () => {
    setActiveTag(null);
    setCurrentPage(1);
  };

  const currentSubCategories = activeCategory ? subCategories[activeCategory] || [] : [];

  return (
    <div className="flex gap-12">
      {/* 왼쪽 사이드바 */}
      <div className="hidden md:block w-32 shrink-0">
        <CategorySidebar activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
      </div>

      {/* 오른쪽 글 목록 */}
      <div className="flex-1 min-w-0">
        {/* 모바일용 카테고리 셀렉트 */}
        <div className="mb-6 md:hidden">
          <select
            value={activeCategory || ""}
            onChange={(e) => handleCategoryChange(e.target.value || null)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">전체</option>
            <option value="프론트엔드">프론트엔드</option>
            <option value="백엔드">백엔드</option>
            <option value="회고">회고</option>
          </select>
        </div>

        {currentSubCategories.length > 0 && (
          <div className="mb-6 flex items-center gap-4 border-b border-border">
            <button
              onClick={() => handleSubCategoryChange(null)}
              className={`pb-2 text-sm transition-colors border-b-2 -mb-[1px] ${
                activeSubCategory === null
                  ? "border-foreground text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              전체
            </button>
            {currentSubCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubCategoryChange(sub)}
                className={`pb-2 text-sm transition-colors border-b-2 -mb-[1px] ${
                  activeSubCategory === sub
                    ? "border-foreground text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {activeTag && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">태그:</span>
            <button
              onClick={clearTagFilter}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground/5"
            >
              #{activeTag}
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* 포스트 목록 */}
        <div className="divide-y divide-border">
          {currentPosts.map((post) => (
            <article key={post.slug} className="py-8 first:pt-0">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <time>{post.date}</time>
                <span>·</span>
                <span>{post.author}</span>
              </div>

              <Link href={`/posts/${post.slug}`} className="group block">
                <h2 className="mb-3 text-xl font-medium leading-snug text-foreground group-hover:underline underline-offset-4">
                  {post.title}
                </h2>
              </Link>

              <p className="mb-4 leading-relaxed text-muted-foreground line-clamp-2">{post.excerpt}</p>

              {/* 세부 기술 태그 */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`text-xs transition-colors ${
                      activeTag === tag ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">해당하는 글이 없습니다.</p>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
              aria-label="이전 페이지"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[2rem] px-2 py-1 text-sm transition-colors ${
                    currentPage === page
                      ? "font-medium text-foreground underline underline-offset-4"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
              aria-label="다음 페이지"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
