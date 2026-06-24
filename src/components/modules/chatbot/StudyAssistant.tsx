"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import {
  Bot,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  askChatbotAction,
  getChatHistoryAction,
  reindexClassroomNotesAction,
} from "@/actions/chatbotActions/_chatbotActions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { ChatMessageItem, ChatbotMode } from "@/types/chatbot.types";
import { cn } from "@/lib/utils";

type StudyAssistantProps = {
  classroomId?: string;
  subjectId?: string;
  noteId?: string;
  subjectName?: string;
  noteTitle?: string;
  isCR?: boolean;
};

const MODE_OPTIONS: { value: ChatbotMode; label: string }[] = [
  { value: "qa", label: "Ask" },
  { value: "summarize", label: "Summarize" },
  { value: "quiz", label: "Quiz me" },
];

const SUGGESTED_PROMPTS: Record<ChatbotMode, string[]> = {
  qa: [
    "What topics are covered in our latest notes?",
    "Find notes about the hardest topic in this subject.",
  ],
  summarize: [
    "Summarize the key points from this subject's notes.",
    "Give me a short revision sheet for exam prep.",
  ],
  quiz: [
    "Quiz me on 5 questions from our approved notes.",
    "Create practice questions with answers at the end.",
  ],
};

export function StudyAssistant({
  classroomId,
  subjectId,
  noteId,
  subjectName,
  noteTitle,
  isCR = false,
}: StudyAssistantProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ChatbotMode>("qa");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isReady = Boolean(classroomId);

  const loadHistory = useCallback(async () => {
    if (!classroomId) return;

    setLoadingHistory(true);
    try {
      const response = await getChatHistoryAction(classroomId);
      if (response.success && response.data) {
        setMessages(response.data.messages as ChatMessageItem[]);
      } else if (!response.success) {
        toast.error(response.error || "Failed to load chat history");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to load chat history";
      toast.error(msg);
    } finally {
      setLoadingHistory(false);
    }
  }, [classroomId]);

  useEffect(() => {
    if (open && classroomId) {
      void loadHistory();
    }
  }, [open, classroomId, loadHistory]);

  const askMutation = useMutation({
    mutationFn: async (payload: Parameters<typeof askChatbotAction>[0]) => {
      const result = await askChatbotAction(payload);
      if (!result.success) {
        throw new Error(result.error || "Failed to get an answer");
      }
      return result;
    },
    onSuccess: (response, variables) => {
      if (!response.data) {
        toast.error(response.message || "Failed to get an answer");
        return;
      }

      const now = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        {
          id: `local-user-${Date.now()}`,
          role: "user",
          content: variables.message,
          createdAt: now,
        },
        {
          id: `local-assistant-${Date.now()}`,
          role: "assistant",
          content: response.data.answer,
          sources: response.data.sources,
          createdAt: now,
        },
      ]);
      setMessage("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Study assistant is unavailable right now.");
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, askMutation.isPending]);

  const reindexMutation = useMutation({
    mutationFn: async () => {
      if (!classroomId) {
        throw new Error("Classroom ID is required");
      }
      const result = await reindexClassroomNotesAction(classroomId);
      if (!result.success) {
        throw new Error(result.error || "Failed to reindex notes");
      }
      return result;
    },
    onSuccess: (response) => {
      if (!response.data) {
        toast.error(response.message || "Failed to reindex notes");
        return;
      }

      toast.success(
        `Indexed ${response.data.notesIndexed} notes (${response.data.chunksIndexed} chunks).`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reindex classroom notes.");
    },
  });

  const submitMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || askMutation.isPending || !classroomId) return;

    askMutation.mutate({
      classroomId,
      message: trimmed,
      ...(subjectId ? { subjectId } : {}),
      ...(noteId ? { noteId } : {}),
      mode,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitMessage(message);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage(message);
    }
  };

  if (!isReady) {
    return null;
  }

  const scopeLabel = noteTitle
    ? `Note: ${noteTitle}`
    : subjectName
      ? `Subject: ${subjectName}`
      : "All classroom notes";

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 rounded-full px-5 shadow-2xl shadow-primary/30"
      >
        <Sparkles className="mr-2 size-5" />
        Study Assistant
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close study assistant"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative flex h-[min(720px,calc(100vh-2rem))] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bot className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">
                    Study Assistant
                  </p>
                  <p className="text-xs text-muted-foreground">{scopeLabel}</p>
                </div>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
              {MODE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={mode === option.value ? "default" : "outline"}
                  className="rounded-full text-xs"
                  onClick={() => setMode(option.value)}
                >
                  {option.label}
                </Button>
              ))}
              {isCR && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="ml-auto rounded-full text-xs"
                  disabled={reindexMutation.isPending}
                  onClick={() => reindexMutation.mutate()}
                >
                  {reindexMutation.isPending ? (
                    <Loader2 className="mr-1 size-3 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1 size-3" />
                  )}
                  Reindex
                </Button>
              )}
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
              {loadingHistory ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Loading conversation...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center text-sm text-muted-foreground">
                  <MessageSquare className="size-8 text-primary/60" />
                  <p>
                    Ask about your subjects, summaries, or request a quick quiz
                    from approved notes in this classroom.
                  </p>
                  <div className="flex w-full flex-col gap-2">
                    {SUGGESTED_PROMPTS[mode].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => submitMessage(prompt)}
                        className="rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-left text-xs transition hover:border-primary/40 hover:bg-primary/5"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      entry.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted/60 text-foreground",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{entry.content}</p>
                    {entry.role === "assistant" && entry.sources?.length ? (
                      <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Sources
                        </p>
                        {entry.sources.map((source) => (
                          <Link
                            key={`${entry.id}-${source.noteId}`}
                            href={`/dashboard/classroom/notes/${source.noteId}`}
                            className="block rounded-xl border border-border/60 bg-background/70 px-3 py-2 transition hover:border-primary/40"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold">
                                {source.noteTitle}
                              </span>
                              <Badge variant="secondary" className="text-[10px]">
                                {Math.round(source.similarity * 100)}%
                              </Badge>
                            </div>
                            <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                              {source.snippet}
                            </p>
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))
              )}

              {askMutation.isPending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-border bg-background/80 p-4"
            >
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    mode === "quiz"
                      ? "Ask for a quiz on a topic..."
                      : mode === "summarize"
                        ? "Ask to summarize a subject or topic..."
                        : "Ask a question about your notes..."
                  }
                  rows={2}
                  className="min-h-[72px] resize-none rounded-2xl"
                  disabled={askMutation.isPending}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="size-12 shrink-0 rounded-2xl"
                  disabled={!message.trim() || askMutation.isPending}
                >
                  {askMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                Enter to send, Shift+Enter for a new line.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
