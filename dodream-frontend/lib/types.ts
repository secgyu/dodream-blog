export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  subCategory: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}
