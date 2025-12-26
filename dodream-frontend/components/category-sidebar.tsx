"use client";

import { CATEGORIES } from "@/lib/constants";

interface CategorySidebarProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategorySidebar({ activeCategory, onCategoryChange }: CategorySidebarProps) {
  return (
    <aside className="sticky top-8">
      <nav className="space-y-1">
        <button
          onClick={() => onCategoryChange(null)}
          className={`block w-full text-left py-2 text-sm transition-colors ${
            activeCategory === null ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          전체
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`block w-full text-left py-2 text-sm transition-colors ${
              activeCategory === category
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </nav>
    </aside>
  );
}
