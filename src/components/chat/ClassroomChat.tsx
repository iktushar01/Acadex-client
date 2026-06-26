"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Pusher from "pusher-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { classroomChannelName } from "@/lib/chat/pusherClient";
import {
  deleteChatMessageAction,
  getChatMessagesAction,
  sendChatMessageAction,
} from "@/actions/chatActions/_chatActions";
import type { ChatMessage, DeleteChatMessageEvent } from "@/types/chat.types";
import { useClassroomRole } from "@/hooks/useClassroomRole";

type ClassroomChatProps = {
  classroomId: string;
  classroomName: string;
  currentUserId?: string;
};

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function ClassroomChat({
  classroomId,
  classroomName,
  currentUserId,
}: ClassroomChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldStickToBottom = useRef(true);
  const initialLoadDone = useRef(false);

  const { isCR } = useClassroomRole(classroomId);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  const loadInitialMessages = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getChatMessagesAction(classroomId);
      if (!result.success) {
        throw new Error(result.error || "Failed to load messages");
      }

      setMessages(result.data ?? []);
      setHasMore(Boolean(result.meta?.hasMore));
      setNextCursor(result.meta?.nextCursor ?? null);
      initialLoadDone.current = true;
      shouldStickToBottom.current = true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load messages",
      );
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  const loadOlderMessages = useCallback(async () => {
    if (!hasMore || !nextCursor || loadingOlder) return;

    const container = listRef.current;
    const previousHeight = container?.scrollHeight ?? 0;

    setLoadingOlder(true);
    try {
      const result = await getChatMessagesAction(classroomId, {
        cursor: nextCursor,
      });
      if (!result.success) {
        throw new Error(result.error || "Failed to load older messages");
      }

      const older = result.data ?? [];

      setMessages((prev) => [...older, ...prev]);
      setHasMore(Boolean(result.meta?.hasMore));
      setNextCursor(result.meta?.nextCursor ?? null);

      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - previousHeight;
        }
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load older messages",
      );
    } finally {
      setLoadingOlder(false);
    }
  }, [classroomId, hasMore, loadingOlder, nextCursor]);

  useEffect(() => {
    initialLoadDone.current = false;
    setMessages([]);
    setNextCursor(null);
    setHasMore(false);
    void loadInitialMessages();
  }, [loadInitialMessages]);

  useEffect(() => {
    if (!initialLoadDone.current || !shouldStickToBottom.current) return;
    scrollToBottom(initialLoadDone.current ? "auto" : "smooth");
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!PUSHER_KEY || !PUSHER_CLUSTER) return;

    const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER });
    const channel = pusher.subscribe(classroomChannelName(classroomId));

    const onNewMessage = (message: ChatMessage) => {
      if (message.classroomId !== classroomId) return;

      setMessages((prev) => {
        if (prev.some((item) => item.id === message.id)) return prev;
        return [...prev, message];
      });

      if (message.sender.id !== currentUserId) {
        shouldStickToBottom.current = true;
      }
    };

    const onDeleteMessage = (payload: DeleteChatMessageEvent) => {
      setMessages((prev) => prev.filter((item) => item.id !== payload.id));
    };

    channel.bind("new-message", onNewMessage);
    channel.bind("delete-message", onDeleteMessage);

    return () => {
      channel.unbind("new-message", onNewMessage);
      channel.unbind("delete-message", onDeleteMessage);
      pusher.unsubscribe(classroomChannelName(classroomId));
      pusher.disconnect();
    };
  }, [classroomId, currentUserId]);

  const handleScroll = () => {
    const container = listRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    shouldStickToBottom.current = distanceFromBottom < 80;

    if (container.scrollTop < 48) {
      void loadOlderMessages();
    }
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || sending) return;

    setSending(true);
    try {
      const result = await sendChatMessageAction({ classroomId, content });
      if (!result.success) {
        throw new Error(result.error || "Failed to send message");
      }

      const message = result.data;

      if (message) {
        setMessages((prev) => {
          if (prev.some((item) => item.id === message.id)) return prev;
          return [...prev, message];
        });
        shouldStickToBottom.current = true;
      }

      setDraft("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message",
      );
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    setDeletingId(messageId);
    try {
      const result = await deleteChatMessageAction(messageId);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete message");
      }

      setMessages((prev) => prev.filter((item) => item.id !== messageId));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete message",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const canDelete = (message: ChatMessage) =>
    Boolean(currentUserId) &&
    (message.sender.id === currentUserId || isCR);

  return (
    <div className="flex h-[min(78vh,720px)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-sm">
      <header className="flex items-center justify-between border-b border-border/60 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold sm:text-base">
            {classroomName} General Chat
          </p>
          <p className="text-xs text-muted-foreground">
            Classroom members only
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-[10px] uppercase">
          Live
        </Badge>
      </header>

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-4"
      >
        {loadingOlder && (
          <div className="flex justify-center py-2">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation for your class.
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender.id === currentUserId;

            return (
              <div
                key={message.id}
                className={cn(
                  "group flex gap-2",
                  isOwn ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm sm:max-w-[70%]",
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {!isOwn && (
                    <p className="mb-1 text-[11px] font-semibold opacity-80">
                      {message.sender.name}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <div
                    className={cn(
                      "mt-1 flex items-center justify-between gap-2 text-[10px]",
                      isOwn ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    <span>{formatTime(message.createdAt)}</span>
                    {canDelete(message) && (
                      <button
                        type="button"
                        onClick={() => void handleDelete(message.id)}
                        disabled={deletingId === message.id}
                        className="opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                        aria-label="Delete message"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <footer className="border-t border-border/60 p-3 sm:p-4">
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={2}
            className="min-h-[44px] resize-none"
            disabled={sending}
          />
          <Button
            type="button"
            onClick={() => void handleSend()}
            disabled={sending || !draft.trim()}
            className="shrink-0"
          >
            {sending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Send className="size-4" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
