"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { BlogHeader } from "@/components/blog-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/");
      }
    } catch {
      setError("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-2xl font-medium text-foreground mb-8 text-center">로그인</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
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

        <p className="mt-8 text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-foreground underline underline-offset-4 hover:text-muted-foreground">
            회원가입
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          * 데모 버전: 아무 이메일/비밀번호로 로그인 가능
        </p>
      </main>
    </div>
  );
}
