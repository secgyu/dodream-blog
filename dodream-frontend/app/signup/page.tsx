"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { BlogHeader } from "@/components/blog-header";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(name, email, password);
      if (success) {
        router.push("/");
      }
    } catch {
      setError("회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-2xl font-medium text-foreground mb-8 text-center">회원가입</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <label htmlFor="name" className="block text-sm text-muted-foreground mb-2">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-muted-foreground mb-2">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-muted-foreground mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-muted-foreground mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-foreground underline underline-offset-4 hover:text-muted-foreground">
            로그인
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          * 데모 버전: 아무 정보로 가입 가능 (새로고침시 초기화)
        </p>
      </main>
    </div>
  );
}
