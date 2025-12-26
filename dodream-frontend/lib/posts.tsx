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

export const posts: Post[] = [
  {
    slug: "building-scalable-design-systems",
    title: "Building Scalable Design Systems with React and TypeScript",
    excerpt:
      "How we approached creating a consistent, maintainable design system that scales across multiple products. Learn about our component architecture, token system, and documentation practices.",
    content: `
디자인 시스템을 구축하면서 가장 중요하게 생각한 것은 **일관성**과 **확장성**이었습니다.

## 왜 디자인 시스템인가?

여러 프로덕트를 개발하다 보면 같은 버튼, 같은 입력 필드를 여러 번 만들게 됩니다. 처음에는 복사-붙여넣기로 해결했지만, 곧 문제가 생겼습니다.

- 디자인이 조금씩 달라지기 시작
- 버그 수정이 모든 곳에 반영되지 않음
- 새로운 팀원이 어떤 컴포넌트를 써야 할지 혼란

## 우리의 접근 방식

### 1. 토큰 시스템 구축

색상, 타이포그래피, 스페이싱 등 모든 디자인 값을 토큰으로 정의했습니다.

\`\`\`typescript
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ...
  }
}
\`\`\`

### 2. 컴포넌트 계층 구조

Atomic Design 패턴을 참고하되, 우리 팀에 맞게 조정했습니다.

- **Primitives**: 가장 기본적인 빌딩 블록 (Box, Text, Icon)
- **Components**: 재사용 가능한 UI 단위 (Button, Input, Card)
- **Patterns**: 복합적인 UI 패턴 (Form, Modal, Navigation)

### 3. TypeScript로 안전하게

모든 컴포넌트에 엄격한 타입을 적용해서, 잘못된 props를 전달하면 바로 에러가 발생하도록 했습니다.

## 결과

- 새로운 페이지 개발 속도 40% 향상
- 디자인 일관성 관련 버그 80% 감소
- 온보딩 시간 단축

다음 글에서는 문서화 시스템에 대해 다루겠습니다.
    `,
    date: "2025년 1월 15일",
    author: "김민수",
    category: "프론트엔드",
    subCategory: "웹",
    tags: ["React", "TypeScript"],
  },
  {
    slug: "migrating-to-nextjs-15",
    title: "Our Journey Migrating to Next.js 15",
    excerpt:
      "A detailed walkthrough of our migration process, the challenges we faced, and the performance improvements we achieved. Includes tips for teams considering the upgrade.",
    content: `
Next.js 15로의 마이그레이션은 생각보다 순탄하지 않았습니다. 하지만 그 과정에서 많은 것을 배웠습니다.

## 마이그레이션 배경

기존에 Next.js 13을 사용하고 있었는데, 15 버전에서 제공하는 새로운 기능들이 매력적이었습니다.

- Turbopack의 안정화
- React Compiler 지원
- 개선된 캐싱 API

## 마이그레이션 과정

### 1단계: 의존성 업데이트

가장 먼저 package.json의 의존성을 업데이트했습니다.

\`\`\`bash
npm install next@15 react@19 react-dom@19
\`\`\`

### 2단계: Breaking Changes 대응

가장 큰 변화는 비동기 API들이었습니다. \`params\`, \`searchParams\`, \`headers\`, \`cookies\` 모두 await가 필요해졌습니다.

\`\`\`typescript
// Before
export default function Page({ params }) {
  const { id } = params
}

// After
export default async function Page({ params }) {
  const { id } = await params
}
\`\`\`

### 3단계: 캐싱 전략 재검토

\`revalidateTag\`에 두 번째 인자가 필요해지면서, 캐싱 전략을 전면 재검토했습니다.

## 성능 개선

마이그레이션 후 측정한 결과:

- 빌드 시간: 45% 단축
- Cold Start: 30% 개선
- 번들 사이즈: 15% 감소

힘들었지만 충분히 가치 있는 업그레이드였습니다.
    `,
    date: "2025년 1월 8일",
    author: "이서연",
    category: "프론트엔드",
    subCategory: "웹",
    tags: ["Next.js"],
  },
  {
    slug: "real-time-collaboration-architecture",
    title: "Designing Real-time Collaboration Features",
    excerpt:
      "Deep dive into the architecture behind our collaborative editing tools. We explore WebSocket implementation, conflict resolution strategies, and optimistic updates.",
    content: `
실시간 협업 기능을 구현하면서 배운 것들을 공유합니다.

## 요구사항

- 여러 사용자가 동시에 문서 편집
- 변경사항 즉시 반영
- 오프라인 지원
- 충돌 해결

## 기술 스택 선정

### WebSocket vs SSE

처음에는 Server-Sent Events를 고려했지만, 양방향 통신이 필요해서 WebSocket을 선택했습니다.

### Socket.io vs ws

운영 편의성을 위해 Socket.io를 선택했습니다. 자동 재연결, 룸 관리 등 편의 기능이 많았습니다.

## 충돌 해결 전략

가장 어려웠던 부분입니다. 여러 방식을 검토한 끝에 Operational Transformation(OT)을 채택했습니다.

\`\`\`typescript
function transform(op1: Operation, op2: Operation): Operation {
  // 두 연산의 위치를 조정
  if (op1.position <= op2.position) {
    return {
      ...op2,
      position: op2.position + op1.text.length
    }
  }
  return op2
}
\`\`\`

## Optimistic Updates

네트워크 지연을 숨기기 위해 낙관적 업데이트를 적용했습니다.

1. 로컬에서 즉시 변경 적용
2. 서버로 변경 전송
3. 충돌 시 롤백 및 재적용

## 결과

- 평균 레이턴시: 50ms 이하
- 동시 편집 지원: 최대 50명
- 충돌 발생률: 0.1% 미만
    `,
    date: "2024년 12월 28일",
    author: "박준영",
    category: "백엔드",
    subCategory: "서버",
    tags: ["WebSocket", "Node.js"],
  },
  {
    slug: "testing-strategies-frontend",
    title: "Frontend Testing Strategies That Actually Work",
    excerpt:
      "After years of trial and error, we've developed a testing approach that balances coverage, speed, and maintainability. Here's what we learned.",
    content: `
"테스트 코드를 작성하세요"라는 말은 쉽지만, 실제로 유지보수 가능한 테스트를 작성하는 것은 어렵습니다.

## 우리가 겪은 문제들

### 1. 깨지기 쉬운 테스트

UI가 조금만 바뀌어도 테스트가 실패했습니다.

### 2. 느린 테스트

E2E 테스트가 너무 많아서 CI가 30분 이상 걸렸습니다.

### 3. 가치 없는 테스트

"테스트 커버리지 100%"를 달성했지만, 버그는 계속 발생했습니다.

## 새로운 접근

### Testing Trophy

Kent C. Dodds의 Testing Trophy 개념을 도입했습니다.

- **E2E 테스트**: 핵심 사용자 플로우만
- **통합 테스트**: 가장 많이
- **유닛 테스트**: 복잡한 비즈니스 로직만
- **정적 분석**: TypeScript, ESLint

### Testing Library 철학

"구현이 아닌 동작을 테스트하라"

\`\`\`typescript
// Bad
expect(button.classList.contains('disabled')).toBe(true)

// Good
expect(button).toBeDisabled()
\`\`\`

### 테스트 우선순위

1. 결제 플로우
2. 인증/인가
3. 핵심 기능
4. 나머지

## 결과

- CI 시간: 30분 → 8분
- 테스트 유지보수 시간: 50% 감소
- 버그 탐지율: 2배 향상
    `,
    date: "2024년 12월 20일",
    author: "최유진",
    category: "프론트엔드",
    subCategory: "웹",
    tags: ["Testing", "Jest"],
  },
  {
    slug: "performance-optimization-case-study",
    title: "From 4s to 400ms: A Performance Optimization Case Study",
    excerpt:
      "How we dramatically improved our app's load time through strategic code splitting, image optimization, and caching strategies.",
    content: `
우리 앱의 초기 로딩 시간이 4초가 넘었습니다. 이를 400ms로 줄인 과정을 공유합니다.

## 현황 분석

Lighthouse와 Web Vitals를 통해 문제점을 파악했습니다.

- LCP: 4.2초
- FID: 180ms
- CLS: 0.25

### 주요 병목

1. 거대한 JavaScript 번들 (2.5MB)
2. 최적화되지 않은 이미지
3. 렌더 블로킹 리소스
4. 서드파티 스크립트

## 최적화 과정

### 1. Code Splitting

\`\`\`typescript
// Before
import HeavyComponent from './HeavyComponent'

// After
const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { loading: () => <Skeleton /> }
)
\`\`\`

### 2. 이미지 최적화

- Next.js Image 컴포넌트 활용
- WebP/AVIF 포맷 적용
- 적절한 sizes 속성 지정

### 3. 캐싱 전략

- Static assets: 1년 캐시
- API responses: stale-while-revalidate
- HTML: no-cache

### 4. 서드파티 스크립트

- 분석 스크립트 지연 로딩
- 불필요한 스크립트 제거

## 결과

- LCP: 4.2초 → 0.4초
- FID: 180ms → 15ms
- CLS: 0.25 → 0.02

Core Web Vitals 모두 녹색으로 전환되었습니다.
    `,
    date: "2024년 12월 12일",
    author: "정하늘",
    category: "프론트엔드",
    subCategory: "웹",
    tags: ["Performance"],
  },
  {
    slug: "api-design-lessons",
    title: "Lessons Learned from Building Our API Layer",
    excerpt:
      "Practical insights from designing and iterating on our REST and GraphQL APIs. Covers versioning, error handling, and developer experience.",
    content: `
3년간 API를 설계하고 운영하면서 배운 것들을 정리했습니다.

## REST vs GraphQL

우리는 둘 다 사용합니다.

- **REST**: 단순한 CRUD, 외부 연동
- **GraphQL**: 복잡한 데이터 요구, 프론트엔드 주도

## 버전 관리

URL 버전 방식을 채택했습니다.

\`\`\`
/api/v1/users
/api/v2/users
\`\`\`

### 버전 업 기준

- Breaking change가 있을 때만
- Minor 변경은 기존 버전 유지
- 최소 2개 버전 동시 운영

## 에러 처리

표준화된 에러 응답 형식을 정의했습니다.

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "이메일 형식이 올바르지 않습니다",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
\`\`\`

## Rate Limiting

- 기본: 100 req/min
- 인증된 사용자: 1000 req/min
- 프리미엄: 10000 req/min

## 문서화

OpenAPI(Swagger)로 문서를 자동 생성하고, 코드와 문서가 항상 일치하도록 했습니다.

개발자 경험(DX)이 API 성공의 핵심입니다.
    `,
    date: "2024년 12월 5일",
    author: "김민수",
    category: "백엔드",
    subCategory: "서버",
    tags: ["API", "GraphQL"],
  },
  {
    slug: "2024-retrospective",
    title: "2024년 Do x Dream 기술팀 회고",
    excerpt:
      "한 해 동안 팀이 성장하며 겪은 도전과 성과들. 새로운 기술 도입, 프로세스 개선, 그리고 앞으로의 방향성에 대해 이야기합니다.",
    content: `
2024년이 끝나갑니다. 팀 전체가 모여 한 해를 돌아보았습니다.

## 숫자로 보는 2024

- 배포 횟수: 847회
- 장애 발생: 12회 (작년 대비 60% 감소)
- 평균 응답 시간: 120ms → 45ms
- 팀원 수: 5명 → 8명

## 잘한 것

### 1. 모노레포 전환

여러 프로젝트를 하나의 레포로 통합하면서:
- 코드 공유가 쉬워짐
- 의존성 관리 단순화
- 일관된 린팅/포매팅

### 2. 온콜 문화 정착

장애 대응 프로세스를 체계화했습니다.
- 온콜 로테이션
- 런북 작성
- 포스트모템 문화

### 3. 기술 공유

매주 금요일 기술 세션을 진행했습니다.
- 40회 진행
- 평균 참석률 90%

## 아쉬운 것

### 1. 기술 부채

새 기능 개발에 쫓겨 기술 부채를 충분히 해결하지 못했습니다.

### 2. 문서화

코드는 늘었는데 문서는 따라가지 못했습니다.

## 2025년 목표

1. 테스트 커버리지 80% 달성
2. 문서화 자동화
3. 성능 모니터링 고도화
4. 주니어 개발자 성장 지원

함께 성장하는 한 해가 되길 바랍니다.
    `,
    date: "2024년 12월 1일",
    author: "팀 전체",
    category: "회고",
    subCategory: "",
    tags: ["팀문화"],
  },
  {
    slug: "react-native-journey",
    title: "React Native로 앱 개발 시작하기",
    excerpt: "웹 개발자가 모바일 앱 개발에 도전한 이야기. React Native의 장단점과 실제 프로덕션 경험을 공유합니다.",
    content: `
웹 개발자로 5년을 일하다가 처음으로 모바일 앱을 개발하게 되었습니다.

## 왜 React Native인가?

### 고려한 옵션들

1. **네이티브 (Swift/Kotlin)**: 학습 곡선이 높음
2. **Flutter**: Dart 언어 학습 필요
3. **React Native**: 기존 React 지식 활용 가능

결국 가장 빠르게 프로덕션에 도달할 수 있는 React Native를 선택했습니다.

## 첫 인상

### 익숙한 것들

- JSX 문법
- useState, useEffect 등 훅
- 컴포넌트 구조

### 낯선 것들

- View, Text, ScrollView 등 새로운 컴포넌트
- StyleSheet (CSS와 비슷하지만 다름)
- 네비게이션 개념

## 겪었던 문제들

### 1. 플랫폼별 차이

같은 코드가 iOS와 Android에서 다르게 보이는 경우가 많았습니다.

\`\`\`typescript
const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
    },
    android: {
      elevation: 4,
    },
  }),
})
\`\`\`

### 2. 네이티브 모듈

카메라, 푸시 알림 등은 네이티브 설정이 필요했습니다.

### 3. 디버깅

웹보다 디버깅이 어려웠습니다. Flipper가 많은 도움이 되었습니다.

## 결론

React Native는 웹 개발자가 모바일에 입문하기에 좋은 선택입니다. 다만 "한 번 작성하면 어디서든 실행된다"는 기대는 버리세요.
    `,
    date: "2024년 11월 28일",
    author: "이서연",
    category: "프론트엔드",
    subCategory: "앱",
    tags: ["React Native"],
  },
  {
    slug: "flutter-vs-react-native",
    title: "Flutter와 React Native 비교 분석",
    excerpt: "두 프레임워크를 실제 프로젝트에 적용해본 경험을 바탕으로 장단점을 비교합니다.",
    content: `
같은 앱을 Flutter와 React Native로 각각 만들어보았습니다.

## 개발 경험

### React Native

**장점**
- JavaScript/TypeScript 사용
- 풍부한 npm 생태계
- 핫 리로딩이 빠름

**단점**
- 브릿지로 인한 성능 오버헤드
- 네이티브 모듈 설정이 번거로움
- 버전 업그레이드가 힘듦

### Flutter

**장점**
- 일관된 UI (픽셀 단위 제어)
- 뛰어난 성능
- 공식 문서가 훌륭함

**단점**
- Dart 언어 학습 필요
- 앱 크기가 큼
- 웹 개발자에게 낯선 문법

## 성능 비교

| 항목 | React Native | Flutter |
|------|--------------|---------|
| 시작 시간 | 1.2초 | 0.8초 |
| 애니메이션 FPS | 55-60 | 60 |
| 앱 크기 | 25MB | 35MB |

## 언제 무엇을 선택할까?

### React Native가 적합한 경우
- 웹 개발 팀이 모바일 확장
- JavaScript 생태계 활용 필요
- 빠른 프로토타이핑

### Flutter가 적합한 경우
- 성능이 중요한 앱
- 복잡한 애니메이션
- 완전히 새로운 팀

## 결론

정답은 없습니다. 팀의 상황과 프로젝트 요구사항에 맞게 선택하세요.
    `,
    date: "2024년 11월 20일",
    author: "박준영",
    category: "프론트엔드",
    subCategory: "앱",
    tags: ["Flutter", "React Native"],
  },
  {
    slug: "database-optimization",
    title: "데이터베이스 쿼리 최적화 가이드",
    excerpt: "대용량 트래픽 환경에서 DB 성능을 개선한 경험과 실전 팁을 공유합니다.",
    content: `
MAU 100만 서비스에서 DB 성능 문제를 해결한 경험을 공유합니다.

## 문제 상황

특정 시간대에 응답 시간이 5초를 넘었습니다.

### 원인 분석

1. N+1 쿼리 문제
2. 인덱스 미설정
3. 불필요한 데이터 조회

## 최적화 과정

### 1. 느린 쿼리 찾기

\`\`\`sql
SELECT * FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
\`\`\`

### 2. 실행 계획 분석

\`\`\`sql
EXPLAIN ANALYZE 
SELECT * FROM orders 
WHERE user_id = 123 
AND created_at > '2024-01-01';
\`\`\`

### 3. 인덱스 추가

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_orders_user_created 
ON orders(user_id, created_at DESC);
\`\`\`

### 4. N+1 해결

\`\`\`typescript
// Before: N+1
const orders = await getOrders()
for (const order of orders) {
  order.items = await getOrderItems(order.id)
}

// After: JOIN
const orders = await getOrdersWithItems()
\`\`\`

### 5. 페이지네이션 개선

Offset 기반에서 Cursor 기반으로 변경했습니다.

## 결과

- 평균 응답 시간: 5초 → 200ms
- DB CPU 사용률: 80% → 30%
- 쿼리 수: 50% 감소

인덱스 하나가 성능을 10배 개선할 수 있습니다.
    `,
    date: "2024년 11월 15일",
    author: "최유진",
    category: "백엔드",
    subCategory: "DB",
    tags: ["PostgreSQL", "최적화"],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAllPosts(): Post[] {
  return posts;
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

export function getAllCategories(): string[] {
  const categorySet = new Set<string>();
  posts.forEach((post) => {
    categorySet.add(post.category);
  });
  return Array.from(categorySet);
}
