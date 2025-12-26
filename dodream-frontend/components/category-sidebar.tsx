"use client";

interface CategorySidebarProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = ["프론트엔드", "백엔드", "회고"];

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
        {categories.map((category) => (
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
