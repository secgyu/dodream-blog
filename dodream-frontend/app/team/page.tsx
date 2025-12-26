import { Metadata } from "next";
import { BlogHeader } from "@/components/blog-header";
import { Github } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Team",
  description: "Do x Dream 팀원 소개 - 함께 성장하는 10명의 개발자들",
};

const teamMembers = [
  { name: "김규민", role: "Frontend", github: "https://github.com/secgyu" },
  { name: "김도균", role: "App", github: "https://github.com/kim-do-kyun" },
  { name: "서보형", role: "Backend", github: "https://github.com/seoftbh" },
  { name: "이승준", role: "Full Stack", github: "https://github.com/sjl0430" },
  { name: "정민수", role: "Full Stack", github: "https://github.com/jms0802" },
  { name: "추지우", role: "Frontend", github: "https://github.com/chuman0216" },
  { name: "최예진", role: "Backend", github: "https://github.com/dPwls03" },
  { name: "최지훈", role: "Designer", github: "https://github.com/jay020420" },
  { name: "한수혁", role: "DevOps", github: "https://github.com/handylan" },
  { name: "한윤성", role: "App", github: "https://github.com/hy68483" },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-4">Team</h1>
        <p className="text-muted-foreground mb-12">Do x Dream을 함께 만들어가는 사람들</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {teamMembers.map((member) => (
            <a
              key={member.name}
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-4 rounded-lg border border-border bg-card hover:border-foreground/20 hover:shadow-sm transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                <span className="text-xl font-medium text-foreground">{member.name.charAt(0)}</span>
              </div>
              <h2 className="text-sm font-medium text-foreground text-center">{member.name}</h2>
              <p className="text-xs text-muted-foreground mb-2">{member.role}</p>
              <Github className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </a>
          ))}
        </div>

        <div className="border-t border-border mt-16 pt-10">
          <p className="text-sm text-muted-foreground text-center">
            함께하고 싶으신가요?{" "}
            <Link
              href="/about"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              연락처 보기
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
