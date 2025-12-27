const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { body, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...rest.headers,
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "API Error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchApi<{ message: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
      }),
    logout: () => fetchApi<{ message: string }>("/auth/logout", { method: "POST" }),
    me: () => fetchApi<{ id: string; email: string; name: string }>("/auth/me"),
    refresh: () => fetchApi<{ message: string }>("/auth/refresh", { method: "POST" }),
  },
  posts: {
    getAll: () => fetchApi<PostResponse[]>("/posts"),
    getBySlug: (slug: string) => fetchApi<PostResponse>(`/posts/slug/${slug}`),
    create: (data: CreatePostData) => fetchApi<PostResponse>("/posts", { method: "POST", body: data }),
    update: (id: string, data: Partial<CreatePostData>) =>
      fetchApi<PostResponse>(`/posts/${id}`, { method: "PATCH", body: data }),
    delete: (id: string) => fetchApi<void>(`/posts/${id}`, { method: "DELETE" }),
    getCategories: () => fetchApi<string[]>("/posts/categories"),
    getTags: () => fetchApi<string[]>("/posts/tags"),
  },
};

export interface PostResponse {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  subCategory: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  subCategory?: string;
  tags: string[];
}
