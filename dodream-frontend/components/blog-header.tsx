"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function BlogHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="group">
            <span className="text-xl font-medium tracking-tight text-foreground">Do x Dream</span>
            <span className="ml-2 text-sm text-muted-foreground">두드림</span>
          </Link>

          <ul className="flex items-center gap-8">
            <li>
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
              >
                Posts
              </Link>
            </li>
            <li>
              <Link
                href="/team"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
              >
                Team
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
              >
                About
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    href="/write"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
                  >
                    글쓰기
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
                  >
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline underline-offset-4"
                >
                  로그인
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
