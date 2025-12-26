"use client";

import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorCommandList,
  EditorBubble,
  EditorBubbleItem,
  type JSONContent,
} from "novel";
import { StarterKit } from "novel";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  CodeSquare,
} from "lucide-react";

interface NovelEditorProps {
  initialContent?: JSONContent;
  onChange?: (content: string) => void;
}

const suggestionItems = [
  { title: "제목 1", description: "큰 제목", icon: Heading1, command: "heading1" },
  { title: "제목 2", description: "중간 제목", icon: Heading2, command: "heading2" },
  { title: "제목 3", description: "작은 제목", icon: Heading3, command: "heading3" },
  { title: "글머리 기호", description: "리스트 생성", icon: List, command: "bulletList" },
  { title: "번호 매기기", description: "번호 리스트", icon: ListOrdered, command: "orderedList" },
  { title: "인용문", description: "인용 블록", icon: Quote, command: "blockquote" },
  { title: "코드 블록", description: "코드 작성", icon: CodeSquare, command: "codeBlock" },
];

const extensions = [
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
];

export function NovelEditor({ initialContent, onChange }: NovelEditorProps) {
  return (
    <div className="relative min-h-[500px] w-full border border-border rounded-lg bg-card overflow-hidden">
      <style jsx global>{`
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
      `}</style>
      <EditorRoot>
        <EditorContent
          extensions={extensions}
          initialContent={initialContent}
          className="novel-editor p-4 min-h-[500px]"
          onUpdate={({ editor }) => {
            const text = editor.getText();
            onChange?.(text);
          }}
          editorProps={{
            attributes: {
              class: "focus:outline-none min-h-[500px]",
            },
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-border bg-popover px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">결과 없음</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  key={item.command}
                  value={item.title}
                  onCommand={({ editor, range }) => {
                    switch (item.command) {
                      case "heading1":
                        editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
                        break;
                      case "heading2":
                        editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
                        break;
                      case "heading3":
                        editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
                        break;
                      case "bulletList":
                        editor.chain().focus().deleteRange(range).toggleBulletList().run();
                        break;
                      case "orderedList":
                        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
                        break;
                      case "blockquote":
                        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
                        break;
                      case "codeBlock":
                        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
                        break;
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-border bg-popover shadow-md">
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleBold().run()}
              className="p-2 hover:bg-accent"
            >
              <Bold className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleItalic().run()}
              className="p-2 hover:bg-accent"
            >
              <Italic className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleStrike().run()}
              className="p-2 hover:bg-accent"
            >
              <Strikethrough className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => editor.chain().focus().toggleCode().run()}
              className="p-2 hover:bg-accent"
            >
              <Code className="h-4 w-4" />
            </EditorBubbleItem>
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
