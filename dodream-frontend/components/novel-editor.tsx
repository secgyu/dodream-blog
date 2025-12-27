"use client";

import { useRef, useState } from "react";
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorCommandList,
  EditorBubble,
  EditorBubbleItem,
} from "novel";
import type { Editor } from "@tiptap/core";
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon, ImageIcon, Upload, Loader2 } from "lucide-react";
import { suggestionItems, editorExtensions, editorStyles } from "@/lib/editor-config";

interface NovelEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "업로드 실패");
  }

  const data = await response.json();
  return data.url;
}

export function NovelEditor({ initialContent, onChange }: NovelEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const hasSetInitialContent = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editorRef.current) return;

    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      editorRef.current.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      alert(error instanceof Error ? error.message : "이미지 업로드에 실패했습니다");
    } finally {
      setIsUploading(false);
      // input 초기화 (같은 파일 다시 선택 가능하게)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative min-h-[500px] w-full border border-border rounded-lg bg-card overflow-hidden">
      <style jsx global>
        {editorStyles}
      </style>

      {/* 이미지 업로드 툴바 */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        <button
          type="button"
          onClick={triggerFileUpload}
          disabled={isUploading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>업로드 중...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>이미지 업로드</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("이미지 URL을 입력하세요:");
            if (url && editorRef.current) {
              editorRef.current.chain().focus().setImage({ src: url }).run();
            }
          }}
          disabled={isUploading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageIcon className="h-4 w-4" />
          <span>URL로 추가</span>
        </button>
        <span className="text-xs text-muted-foreground">또는 /이미지 명령어 사용</span>
      </div>

      {/* 업로드 중 오버레이 */}
      {isUploading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-50">
          <div className="flex items-center gap-2 px-4 py-2 bg-popover rounded-md shadow-lg border border-border">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>이미지 업로드 중...</span>
          </div>
        </div>
      )}

      <EditorRoot>
        <EditorContent
          extensions={editorExtensions}
          className="novel-editor p-4 min-h-[450px]"
          onCreate={({ editor }) => {
            editorRef.current = editor;
            if (initialContent && !hasSetInitialContent.current) {
              editor.commands.setContent(initialContent);
              hasSetInitialContent.current = true;
            }
          }}
          onUpdate={({ editor }) => {
            const html = editor.getHTML();
            console.log(html);
            onChange?.(html);
          }}
          editorProps={{
            attributes: {
              class: "focus:outline-none min-h-[450px]",
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
                      case "imageUpload":
                        // 파일 업로드 다이얼로그 열기
                        editor.chain().focus().deleteRange(range).run();
                        triggerFileUpload();
                        break;
                      case "imageUrl":
                        // 외부 이미지 URL 입력
                        const imageUrl = window.prompt("이미지 URL을 입력하세요:");
                        if (imageUrl) {
                          editor.chain().focus().deleteRange(range).setImage({ src: imageUrl }).run();
                        }
                        break;
                      case "link":
                        const linkUrl = window.prompt("링크 URL을 입력하세요:");
                        if (linkUrl) {
                          editor.chain().focus().deleteRange(range).setLink({ href: linkUrl }).run();
                        }
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
            <EditorBubbleItem
              onSelect={(editor) => {
                const url = window.prompt("링크 URL을 입력하세요:");
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className="p-2 hover:bg-accent"
            >
              <LinkIcon className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem onSelect={() => triggerFileUpload()} className="p-2 hover:bg-accent">
              <Upload className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => {
                const url = window.prompt("이미지 URL을 입력하세요:");
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }}
              className="p-2 hover:bg-accent"
            >
              <ImageIcon className="h-4 w-4" />
            </EditorBubbleItem>
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
