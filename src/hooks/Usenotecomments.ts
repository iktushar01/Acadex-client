"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCommentsAction,
  addCommentAction,
  deleteCommentAction,
  toggleCommentLikeAction,
} from "@/actions/_notedetailactions";
import type { INoteComment } from "@/types/note-detail.types";

const appendReplyToCommentTree = (
  comments: INoteComment[],
  parentId: string,
  reply: INoteComment
): INoteComment[] =>
  comments.map((comment) =>
    comment.id === parentId
      ? { ...comment, replies: [...comment.replies, reply] }
      : comment
  );

const removeCommentFromTree = (
  comments: INoteComment[],
  commentId: string
): INoteComment[] =>
  comments
    .filter((comment) => comment.id !== commentId)
    .map((comment) => ({
      ...comment,
      replies: comment.replies.filter((reply) => reply.id !== commentId),
    }));

const updateCommentInTree = (
  comments: INoteComment[],
  commentId: string,
  updater: (comment: INoteComment) => INoteComment
): INoteComment[] =>
  comments.map((comment) => {
    if (comment.id === commentId) {
      return updater(comment);
    }

    return {
      ...comment,
      replies: comment.replies.map((reply) =>
        reply.id === commentId ? updater(reply) : reply
      ),
    };
  });

export function useNoteComments(noteId: string) {
  const [comments, setComments] = useState<INoteComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [likingId, setLikingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!noteId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const res = await getCommentsAction(noteId);
    setComments(res.success ? res.data : []);
    if (!res.success) {
      setError(res.error ?? "Failed to load comments");
    }
    setLoading(false);
  }, [noteId]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchComments();
    });
  }, [fetchComments]);

  const addComment = useCallback(
    async (content: string, parentId?: string) => {
      setError(null);
      setSubmitting(true);
      const res = await addCommentAction(noteId, content, parentId);

      if (res.success && res.data) {
        setComments((prev) =>
          parentId
            ? appendReplyToCommentTree(prev, parentId, res.data!)
            : [res.data!, ...prev]
        );
      } else {
        setError(res.error ?? "Failed to post comment");
      }

      setSubmitting(false);
      return res.success;
    },
    [noteId]
  );

  const deleteComment = useCallback(async (commentId: string) => {
    setDeletingId(commentId);
    setError(null);

    const previous = comments;
    setComments((prev) => removeCommentFromTree(prev, commentId));

    const res = await deleteCommentAction(commentId);
    if (!res.success) {
      setComments(previous);
      setError(res.error ?? "Failed to delete comment");
    }

    setDeletingId(null);
  }, [comments]);

  const toggleLike = useCallback(async (commentId: string) => {
    setLikingId(commentId);
    setError(null);

    const previous = comments;
    setComments((prev) =>
      updateCommentInTree(prev, commentId, (comment) => ({
        ...comment,
        isLikedByMe: !comment.isLikedByMe,
        likeCount: comment.isLikedByMe
          ? Math.max(0, comment.likeCount - 1)
          : comment.likeCount + 1,
      }))
    );

    const res = await toggleCommentLikeAction(commentId);

    if (!res.success || typeof res.isLiked !== "boolean") {
      setComments(previous);
      setError(res.error ?? "Failed to update comment like");
    } else {
      setComments((prev) =>
        updateCommentInTree(prev, commentId, (comment) => ({
          ...comment,
          isLikedByMe: res.isLiked!,
          likeCount: res.likeCount ?? comment.likeCount,
        }))
      );
    }

    setLikingId(null);
  }, [comments]);

  return {
    comments,
    loading,
    submitting,
    deletingId,
    likingId,
    error,
    addComment,
    deleteComment,
    toggleLike,
    refetch: fetchComments,
  };
}
