export const CATEGORIES = ["프론트엔드", "백엔드", "회고"] as const;
export type Category = (typeof CATEGORIES)[number];

export const SUB_CATEGORIES: Record<string, string[]> = {
  프론트엔드: ["웹", "앱"],
  백엔드: ["서버", "DB"],
};

export const POSTS_PER_PAGE = 5;
