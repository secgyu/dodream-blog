import { StarterKit } from "novel";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { InputRule } from "@tiptap/core";

// 마크다운 링크 문법 [텍스트](URL) 자동 변환 InputRule
const markdownLinkInputRule = new InputRule({
  find: /\[([^\]]+)\]\(([^)]+)\)\s$/,
  handler: ({ state, range, match }) => {
    const [, text, url] = match;
    const { tr } = state;

    if (text && url) {
      const start = range.from;
      const end = range.to;

      tr.delete(start, end);
      tr.insertText(text, start);
      tr.addMark(
        start,
        start + text.length,
        state.schema.marks.link.create({ href: url })
      );
    }
  },
});

// 마크다운 이미지 문법 ![alt](URL) 자동 변환 InputRule
const markdownImageInputRule = new InputRule({
  find: /!\[([^\]]*)\]\(([^)]+)\)\s$/,
  handler: ({ state, range, match }) => {
    const [, alt, src] = match;
    const { tr } = state;

    if (src) {
      tr.delete(range.from, range.to);
      const node = state.schema.nodes.image.create({ src, alt: alt || "" });
      tr.insert(range.from, node);
    }
  },
});

// Link 확장에 마크다운 InputRule 추가
const CustomLink = Link.extend({
  addInputRules() {
    return [markdownLinkInputRule];
  },
});

// Image 확장에 마크다운 InputRule 추가  
const CustomImage = Image.extend({
  addInputRules() {
    return [markdownImageInputRule];
  },
  // HTML 파싱 시 src, alt, title 속성을 제대로 인식하도록 설정
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
      },
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
      },
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
      },
    };
  },
});
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  CodeSquare,
  ImageIcon,
  Link as LinkIcon,
  Upload,
  type LucideIcon,
} from "lucide-react";

export interface SuggestionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  command: string;
}

export const suggestionItems: SuggestionItem[] = [
  { title: "제목 1", description: "큰 제목", icon: Heading1, command: "heading1" },
  { title: "제목 2", description: "중간 제목", icon: Heading2, command: "heading2" },
  { title: "제목 3", description: "작은 제목", icon: Heading3, command: "heading3" },
  { title: "글머리 기호", description: "리스트 생성", icon: List, command: "bulletList" },
  { title: "번호 매기기", description: "번호 리스트", icon: ListOrdered, command: "orderedList" },
  { title: "인용문", description: "인용 블록", icon: Quote, command: "blockquote" },
  { title: "코드 블록", description: "코드 작성", icon: CodeSquare, command: "codeBlock" },
  { title: "이미지 업로드", description: "파일에서 이미지 업로드", icon: Upload, command: "imageUpload" },
  { title: "이미지 URL", description: "외부 이미지 URL 삽입", icon: ImageIcon, command: "imageUrl" },
  { title: "링크", description: "링크 삽입", icon: LinkIcon, command: "link" },
];

export const editorExtensions = [
  StarterKit.configure({
    blockquote: {
      HTMLAttributes: { class: "border-l-4 border-border pl-4 italic text-muted-foreground my-4" },
    },
    codeBlock: {
      HTMLAttributes: { class: "rounded-md bg-muted p-4 font-mono text-sm my-4" },
    },
    code: {
      HTMLAttributes: { class: "rounded bg-muted px-1.5 py-0.5 font-mono text-sm" },
    },
    heading: {
      levels: [1, 2, 3],
    },
  }),
  CustomLink.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
    HTMLAttributes: {
      class: "text-primary underline underline-offset-4 hover:text-primary/80 cursor-pointer",
    },
  }),
  CustomImage.configure({
    inline: false,
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg max-w-full h-auto my-4",
    },
  }),
];

export const editorStyles = `
  .novel-editor h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .novel-editor h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }
  .novel-editor h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  .novel-editor p {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  .novel-editor ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .novel-editor ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .novel-editor li {
    margin-bottom: 0.25rem;
    display: list-item;
  }
  .novel-editor li > p {
    display: inline;
    margin: 0;
  }
`;

