import { Metadata } from "next";
import { BlogHeader } from "@/components/blog-header";

export const metadata: Metadata = {
  title: "About",
  description: "Do x Dream 팀 소개 - 기술을 통해 꿈을 실현하는 개발자들의 모임입니다.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-12">About</h1>

        <section className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            <span className="text-foreground font-medium">Do x Dream (두드림)</span>은 기술을 통해 꿈을 실현하는
            개발자들의 모임입니다.
          </p>

          <p>우리는 웹과 앱 개발에 대한 경험과 지식을 나누고, 함께 성장하기 위해 이 블로그를 운영하고 있습니다.</p>

          <div className="border-t border-border my-10" />

          <h2 className="text-xl font-medium text-foreground mt-10 mb-4">블로그 목적</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>프론트엔드/백엔드 개발 경험 공유</li>
            <li>새로운 기술 트렌드 학습 및 정리</li>
            <li>프로젝트 회고를 통한 성찰</li>
            <li>팀원 간 기술 교류</li>
          </ul>

          <div className="border-t border-border my-10" />

          <h2 className="text-xl font-medium text-foreground mt-10 mb-4">기술 스택</h2>
          <div className="flex flex-wrap gap-2">
            {["Next.js", "React", "TypeScript", "React Native", "Spring", "Node.js", "PostgreSQL"].map((tech) => (
              <span key={tech} className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-full">
                {tech}
              </span>
            ))}
          </div>

          <div className="border-t border-border my-10" />

          <h2 className="text-xl font-medium text-foreground mt-10 mb-4">연락처</h2>
          <p>
            문의사항이나 협업 제안은 이메일로 연락주세요.
            <br />
            <a
              href="mailto:hello@doxdream.dev"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              hello@doxdream.dev
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
