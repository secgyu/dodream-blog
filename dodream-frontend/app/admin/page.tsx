"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, PostResponse } from "@/lib/api";
import Link from "next/link";

export default function AdminPage() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const data = await api.posts.getAll();
      setPosts(data);
    } catch (err) {
      console.error("게시글 로드 실패:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (!success) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch {
      setError("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.posts.delete(id);
      setPosts(posts.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const handleEdit = (slug: string) => {
    router.push(`/write?edit=${slug}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-sm px-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-foreground">관리자 로그인</h1>
            <p className="text-sm text-muted-foreground mt-2">Do x Dream 블로그 관리</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@dodream.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-foreground">게시글 관리</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.name || user.email}님 환영합니다</p>
          </div>
          <div className="flex gap-3">
            <Link href="/write">
              <Button>새 글 작성</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        </div>

        {postsLoading ? (
          <div className="text-center py-12 text-muted-foreground">로딩 중...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">아직 작성된 게시글이 없습니다.</p>
            <Link href="/write">
              <Button>첫 글 작성하기</Button>
            </Link>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">제목</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-24">카테고리</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-24">작성자</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-28">작성일</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-muted-foreground w-32">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{post.category}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{post.author}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {deleteConfirm === post.id ? (
                          <>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>
                              확인
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)}>
                              취소
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(post.slug)}>
                              수정
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteConfirm(post.id)}
                            >
                              삭제
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← 블로그로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
