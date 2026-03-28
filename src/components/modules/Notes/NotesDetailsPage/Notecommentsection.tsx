"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  Heart,
  Loader2,
  MessageSquare,
  Reply,
  Send,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNoteComments } from "@/hooks/Usenotecomments";
import type { INoteComment } from "@/types/note-detail.types";
import { formatDate } from "../NotesMainPage";

interface CurrentUserMeta {
  id?: string;
  name?: string;
  image?: string | null;
  role?: string;
}

const INITIAL_VISIBLE = 5;

const CommentAvatar = ({
  name,
  image,
}: {
  name?: string;
  image?: string | null;
}) => (
  <div className="shrink-0">
    {image ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "User"}
        className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
      />
    ) : (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/15 ring-1 ring-orange-500/20">
        <span className="select-none text-xs font-black text-orange-500">
          {name?.[0]?.toUpperCase() ?? "?"}
        </span>
      </div>
    )}
  </div>
);

const CommentInput = ({
  onSubmit,
  submitting,
  placeholder,
  buttonLabel,
  compact = false,
  currentUser,
  onCancel,
}: {
  onSubmit: (content: string) => Promise<boolean>;
  submitting: boolean;
  placeholder: string;
  buttonLabel: string;
  compact?: boolean;
  currentUser?: CurrentUserMeta;
  onCancel?: () => void;
}) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, compact ? 120 : 160)}px`;
  };

  const submit = async () => {
    if (!value.trim() || submitting) return;
    const ok = await onSubmit(value);
    if (ok) {
      setValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <div className={`flex gap-3 ${compact ? "" : "pt-4 border-t border-border/30"}`}>
      <CommentAvatar name={currentUser?.name} image={currentUser?.image} />

      <div className="min-w-0 flex-1">
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-background/50 transition-all focus-within:border-orange-500/40 focus-within:ring-1 focus-within:ring-orange-500/20">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none"
            style={{ minHeight: compact ? "40px" : "44px" }}
          />
          <div className="flex items-center justify-between border-t border-border/20 px-3 py-2">
            <p className="text-[10px] text-muted-foreground/35">Ctrl/Cmd + Enter to send</p>
            <div className="flex items-center gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="h-8 rounded-xl px-3 text-xs"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={() => void submit()}
                disabled={!value.trim() || submitting}
                className="h-8 rounded-xl px-3 text-xs"
              >
                {submitting ? (
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="mr-1 h-3.5 w-3.5" />
                )}
                {buttonLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({
  comment,
  currentUser,
  deletingId,
  likingId,
  submitting,
  onDelete,
  onToggleLike,
  onReply,
}: {
  comment: INoteComment;
  currentUser?: CurrentUserMeta;
  deletingId: string | null;
  likingId: string | null;
  submitting: boolean;
  onDelete: (commentId: string) => void;
  onToggleLike: (commentId: string) => void;
  onReply: (parentId: string, content: string) => Promise<boolean>;
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const canDelete =
    currentUser?.id === comment.user.id ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPER_ADMIN";
  const isDeleting = deletingId === comment.id;
  const isLiking = likingId === comment.id;

  return (
    <div className="flex gap-3">
      <CommentAvatar name={comment.user.name} image={comment.user.image} />

      <div className="min-w-0 flex-1">
        <div
          className={`rounded-2xl border border-border/30 bg-background/40 px-4 py-3 transition-opacity ${
            isDeleting ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold">{comment.user.name}</span>
            <span className="text-[10px] text-muted-foreground/25">•</span>
            <time
              dateTime={comment.createdAt}
              className="text-[10px] text-muted-foreground/45"
            >
              {formatDate(comment.createdAt)}
            </time>
            {currentUser?.id === comment.user.id && (
              <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-orange-500">
                You
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-foreground/80">
            {comment.content}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onToggleLike(comment.id)}
              disabled={isLiking}
              className={`h-7 rounded-xl px-2.5 text-xs ${
                comment.isLikedByMe ? "text-rose-500" : ""
              }`}
            >
              {isLiking ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Heart
                  className={`mr-1 h-3.5 w-3.5 ${
                    comment.isLikedByMe ? "fill-rose-500" : ""
                  }`}
                />
              )}
              {comment.likeCount}
            </Button>

            {!comment.parentId && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyInput((prev) => !prev)}
                className="h-7 rounded-xl px-2.5 text-xs"
              >
                <Reply className="mr-1 h-3.5 w-3.5" />
                Reply
              </Button>
            )}

            {canDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onDelete(comment.id)}
                disabled={isDeleting}
                className="h-7 rounded-xl px-2.5 text-xs text-destructive hover:text-destructive"
              >
                {isDeleting ? (
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                )}
                Delete
              </Button>
            )}
          </div>
        </div>

        {showReplyInput && (
          <div className="mt-3 pl-2">
            <CommentInput
              compact
              submitting={submitting}
              placeholder={`Reply to ${comment.user.name}...`}
              buttonLabel="Reply"
              currentUser={currentUser}
              onCancel={() => setShowReplyInput(false)}
              onSubmit={async (content) => {
                const ok = await onReply(comment.id, content);
                if (ok) {
                  setShowReplyInput(false);
                }
                return ok;
              }}
            />
          </div>
        )}

        {comment.replies.length > 0 && (
          <div className="mt-3 flex flex-col gap-3 border-l border-border/30 pl-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                deletingId={deletingId}
                likingId={likingId}
                submitting={submitting}
                onDelete={onDelete}
                onToggleLike={onToggleLike}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const NoteCommentSection = ({
  noteId,
  currentUser,
}: {
  noteId: string;
  currentUser?: CurrentUserMeta;
}) => {
  const {
    comments,
    loading,
    submitting,
    deletingId,
    likingId,
    error,
    addComment,
    deleteComment,
    toggleLike,
  } = useNoteComments(noteId);

  const [showAll, setShowAll] = useState(false);

  const totalCommentCount = useMemo(
    () =>
      comments.reduce(
        (count, comment) => count + 1 + comment.replies.length,
        0
      ),
    [comments]
  );

  const visibleComments = showAll ? comments : comments.slice(0, INITIAL_VISIBLE);
  const hiddenCount = Math.max(0, comments.length - INITIAL_VISIBLE);

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-border/30 px-5 py-4">
        <MessageSquare className="h-4 w-4 text-orange-500" />
        <h2 className="text-sm font-black tracking-tight">
          Comments
          {totalCommentCount > 0 && (
            <span className="ml-1.5 text-xs font-bold text-muted-foreground/50">
              ({totalCommentCount})
            </span>
          )}
        </h2>
      </div>

      <div className="flex flex-col gap-4 p-5">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/15 bg-red-500/8 px-3 py-2 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted/30" />
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-32 rounded bg-muted/30" />
                  <div className="h-3 w-full rounded bg-muted/20" />
                  <div className="h-3 w-3/4 rounded bg-muted/15" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center">
            <MessageSquare className="mx-auto mb-2 h-8 w-8 text-muted-foreground/15" />
            <p className="text-sm font-medium text-muted-foreground/40">
              No comments yet. Be the first!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {visibleComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                deletingId={deletingId}
                likingId={likingId}
                submitting={submitting}
                onDelete={deleteComment}
                onToggleLike={toggleLike}
                onReply={(parentId, content) => addComment(content, parentId)}
              />
            ))}

            {comments.length > INITIAL_VISIBLE && (
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="self-center text-xs font-bold text-muted-foreground/50 transition-colors hover:text-orange-500"
              >
                <span className="inline-flex items-center gap-1.5">
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      showAll ? "rotate-180" : ""
                    }`}
                  />
                  {showAll
                    ? "Show fewer comments"
                    : `Show ${hiddenCount} more thread${hiddenCount !== 1 ? "s" : ""}`}
                </span>
              </button>
            )}
          </div>
        )}

        <CommentInput
          submitting={submitting}
          placeholder="Add a comment..."
          buttonLabel="Comment"
          currentUser={currentUser}
          onSubmit={(content) => addComment(content)}
        />
      </div>
    </Card>
  );
};
