"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bot,
  ChevronDown,
  Loader2,
  MessageSquarePlus,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  clearChatSessionAction,
  createChatSessionAction,
  getChatHistoryAction,
  listChatSessionsAction,
  reindexClassroomNotesAction,
} from "@/actions/chatbotActions/_chatbotActions";
import { streamChatbotAsk } from "@/lib/chatbot/streamChatbot";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type {
  ChatMessageItem,
  ChatSessionItem,
  ChatbotMode,
  ChatSource,
  ExplanationLevel,
} from "@/types/chatbot.types";
import { cn } from "@/lib/utils";
import { StudyAssistantIndexPanel } from "./StudyAssistantIndexPanel";

type StudyAssistantProps = {
  classroomId?: string;
  subjectId?: string;
  noteId?: string;
  folderId?: string;
  subjectName?: string;
  noteTitle?: string;
  isCR?: boolean;
};

const MODE_OPTIONS: { value: ChatbotMode; label: string }[] = [
  { value: "qa", label: "Ask" },
  { value: "summarize", label: "Summarize" },
  { value: "quiz", label: "Quiz" },
  { value: "study_plan", label: "Study Plan" },
];

const LEVEL_OPTIONS: { value: ExplanationLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "exam", label: "Exam" },
  { value: "advanced", label: "Advanced" },
];

const SUGGESTED_PROMPTS: Record<ChatbotMode, string[]> = {
  qa: [
    "Explain the hardest topic from our latest notes.",
    "What key concepts should I revise first?",
  ],
  summarize: [
    "Summarize key points with definitions and formulas.",
    "Give me exam tips and common mistakes.",
  ],
  quiz: [
    "Create mixed MCQ and short-answer questions.",
    "Quiz me with True/False and fill-in-the-blank.",
  ],
  study_plan: [
    "Help me prepare for tomorrow's exam.",
    "Build a 3-day revision schedule for this subject.",
  ],
};

const formatCitationContent = (content: string) =>
  content.replace(/\[Source (\d+)\]/g, "**[Source $1]**");

export function StudyAssistant({
  classroomId,
  subjectId,
  noteId,
  folderId,
  subjectName,
  noteTitle,
  isCR = false,
}: StudyAssistantProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ChatbotMode>("qa");
  const [level, setLevel] = useState<ExplanationLevel>("beginner");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [sessions, setSessions] = useState<ChatSessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showIndexPanel, setShowIndexPanel] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isReady = Boolean(classroomId);

  const loadSessions = useCallback(async () => {
    if (!classroomId) return;
    const response = await listChatSessionsAction(classroomId);
    if (response.success && response.data) {
      setSessions(response.data);
    }
  }, [classroomId]);

  const loadHistory = useCallback(
    async (sessionId?: string | null) => {
      if (!classroomId) return;

      setLoadingHistory(true);
      try {
        const response = await getChatHistoryAction(
          classroomId,
          sessionId ?? undefined,
        );
        if (response.success && response.data) {
          setMessages(response.data.messages as ChatMessageItem[]);
          setActiveSessionId(response.data.sessionId);
        } else if (!response.success) {
          toast.error(response.error || "Failed to load chat history");
        }
      } catch (error: unknown) {
        const msg =
          error instanceof Error ? error.message : "Failed to load chat history";
        toast.error(msg);
      } finally {
        setLoadingHistory(false);
      }
    },
    [classroomId],
  );

  useEffect(() => {
    if (open && classroomId) {
      void loadSessions();
      void loadHistory();
    }
  }, [open, classroomId, loadSessions, loadHistory]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isStreaming]);

  const submitMessage = async (text: string, revealQuizAnswers = false) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming || !classroomId) return;

    const now = new Date().toISOString();
    const userMessageId = `local-user-${Date.now()}`;
    const assistantMessageId = `local-assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: trimmed,
        createdAt: now,
        mode,
      },
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        createdAt: now,
        mode,
      },
    ]);
    setMessage("");
    setIsStreaming(true);

    try {
      let streamedContent = "";
      let streamedSources: ChatSource[] = [];

      for await (const event of streamChatbotAsk({
        classroomId,
        message: trimmed,
        mode,
        level,
        revealQuizAnswers,
        ...(subjectId ? { subjectId } : {}),
        ...(noteId ? { noteId } : {}),
        ...(folderId ? { folderId } : {}),
        ...(activeSessionId ? { sessionId: activeSessionId } : {}),
      })) {
        if (event.type === "meta") {
          streamedSources = event.sources;
          setActiveSessionId(event.sessionId);
        }

        if (event.type === "token") {
          streamedContent += event.content;
          setMessages((prev) =>
            prev.map((entry) =>
              entry.id === assistantMessageId
                ? { ...entry, content: streamedContent, sources: streamedSources }
                : entry,
            ),
          );
        }
      }

      void loadSessions();
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : "Study assistant is unavailable right now.";
      toast.error(msg);
      setMessages((prev) => prev.filter((entry) => entry.id !== assistantMessageId));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void submitMessage(message);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage(message);
    }
  };

  const handleNewChat = async () => {
    if (!classroomId) return;
    const response = await createChatSessionAction({ classroomId });
    if (response.success && response.data) {
      setActiveSessionId(response.data.id);
      setMessages([]);
      void loadSessions();
      toast.success("New conversation started");
    } else {
      toast.error(response.error || "Failed to start new chat");
    }
  };

  const handleClearChat = async () => {
    if (!activeSessionId) {
      setMessages([]);
      return;
    }

    const response = await clearChatSessionAction(activeSessionId);
    if (response.success) {
      setMessages([]);
      toast.success("Chat cleared");
    } else {
      toast.error(response.error || "Failed to clear chat");
    }
  };

  const handleReindex = async () => {
    if (!classroomId) return;
    const response = await reindexClassroomNotesAction(classroomId);
    if (response.success) {
      toast.success(response.data?.message || "Reindex started in background");
    } else {
      toast.error(response.error || "Failed to reindex notes");
    }
  };

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((entry) => entry.role === "assistant");

  const showQuizReveal =
    mode === "quiz" &&
    lastAssistantMessage?.content.includes("Show answers") &&
    !isStreaming;

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
        <div className="fixed inset-0 z-50 flex items-end justify-end p-2 sm:p-6">
          <button
            type="button"
            aria-label="Close study assistant"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative flex h-[min(760px,calc(100vh-1rem))] w-full max-w-lg flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bot className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">
                    Study Assistant 2.0
                  </p>
                  <p className="text-xs text-muted-foreground">{scopeLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" size="icon" variant="ghost" onClick={() => void handleNewChat()}>
                  <MessageSquarePlus className="size-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => void handleClearChat()}>
                  <Trash2 className="size-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => setOpen(false)}>
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            {sessions.length > 1 && (
              <div className="border-b border-border px-4 py-2">
                <div className="flex items-center gap-2">
                  <ChevronDown className="size-3 text-muted-foreground" />
                  <select
                    className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs"
                    value={activeSessionId ?? ""}
                    onChange={(event) => {
                      const nextSessionId = event.target.value;
                      setActiveSessionId(nextSessionId);
                      void loadHistory(nextSessionId);
                    }}
                  >
                    {sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.title} ({session.messageCount})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 border-b border-border px-3 py-2 sm:px-4 sm:py-3">
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
            </div>

            <div className="flex flex-wrap gap-2 border-b border-border px-3 py-2 sm:px-4">
              {LEVEL_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={level === option.value ? "secondary" : "ghost"}
                  className="rounded-full text-[11px]"
                  onClick={() => setLevel(option.value)}
                >
                  {option.label}
                </Button>
              ))}
              {isCR && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="ml-auto rounded-full text-xs"
                    onClick={() => void handleReindex()}
                  >
                    <RefreshCw className="mr-1 size-3" />
                    Reindex
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs"
                    onClick={() => setShowIndexPanel((prev) => !prev)}
                  >
                    Index Stats
                  </Button>
                </>
              )}
            </div>

            {showIndexPanel && isCR && classroomId && (
              <StudyAssistantIndexPanel classroomId={classroomId} />
            )}

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
              {loadingHistory ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Loading conversation...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-2 text-center text-sm text-muted-foreground">
                  <MessageSquarePlus className="size-8 text-primary/60" />
                  <p>
                    Ask, summarize, quiz, or build a study plan — grounded in
                    approved classroom notes only.
                  </p>
                  <div className="flex w-full flex-col gap-2">
                    {SUGGESTED_PROMPTS[mode].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void submitMessage(prompt)}
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
                      "max-w-[94%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      entry.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted/60 text-foreground",
                    )}
                  >
                    <p className="whitespace-pre-wrap">
                      {entry.role === "assistant"
                        ? formatCitationContent(entry.content)
                        : entry.content}
                    </p>
                    {entry.role === "assistant" && entry.sources?.length ? (
                      <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Sources
                        </p>
                        {entry.sources.map((source) => (
                          <Link
                            key={`${entry.id}-${source.noteId}-${source.sourceIndex}`}
                            href={`/dashboard/classroom/notes/${source.noteId}`}
                            className="block rounded-xl border border-border/60 bg-background/70 px-3 py-2 transition hover:border-primary/40"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold">
                                [Source {source.sourceIndex}] {source.noteTitle}
                              </span>
                              <Badge variant="secondary" className="text-[10px]">
                                {Math.round(source.similarity * 100)}%
                              </Badge>
                            </div>
                            {source.pageNumber ? (
                              <p className="mt-1 text-[10px] text-muted-foreground">
                                Page {source.pageNumber}
                              </p>
                            ) : null}
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

              {isStreaming && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>

            {showQuizReveal && (
              <div className="border-t border-border px-4 py-2">
                <Button
                  type="button"
                  size="sm"
                  className="w-full rounded-full"
                  onClick={() => void submitMessage("Show answers", true)}
                >
                  Show answers
                </Button>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="border-t border-border bg-background/80 p-3 sm:p-4"
            >
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    mode === "study_plan"
                      ? "Describe your exam and timeline..."
                      : mode === "quiz"
                        ? "Ask for a quiz on a topic..."
                        : mode === "summarize"
                          ? "Ask to summarize notes..."
                          : "Ask a question about your notes..."
                  }
                  rows={2}
                  className="min-h-[72px] resize-none rounded-2xl"
                  disabled={isStreaming}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="size-12 shrink-0 rounded-2xl"
                  disabled={!message.trim() || isStreaming}
                >
                  {isStreaming ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                Enter to send · Shift+Enter for new line · Answers cite [Source N]
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
