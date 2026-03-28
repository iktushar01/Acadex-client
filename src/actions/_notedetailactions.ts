"use server";

import { getNoteByIdService } from "@/services/notes/note.service";
import {
  getFavoriteStatusService,
  toggleFavoriteService,
} from "@/services/favorite/favorite.service";
import {
  createCommentService,
  deleteCommentService,
  getCommentsByNoteService,
  toggleCommentLikeService,
} from "@/services/comment/comment.service";
import type { INote } from "@/types/note.types";
import type { INoteComment } from "@/types/note-detail.types";

const getErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  const maybeAxios = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return (
    maybeAxios?.response?.data?.message ??
    maybeAxios?.message ??
    fallback
  );
};

export async function toggleFavoriteAction(noteId: string): Promise<{
  success: boolean;
  isFavorited: boolean;
  error?: string;
}> {
  try {
    const result = await toggleFavoriteService(noteId);

    return {
      success: result.success,
      isFavorited: result.data.isFavorited,
    };
  } catch (error) {
    return {
      success: false,
      isFavorited: false,
      error: getErrorMessage(error, "Failed to update favorite"),
    };
  }
}

export async function getFavoriteStatusAction(noteId: string): Promise<{
  success: boolean;
  isFavorited: boolean;
  error?: string;
}> {
  try {
    const result = await getFavoriteStatusService(noteId);

    return {
      success: result.success,
      isFavorited: result.data.isFavorited,
    };
  } catch (error) {
    return {
      success: false,
      isFavorited: false,
      error: getErrorMessage(error, "Failed to load favorite status"),
    };
  }
}

export async function getCommentsAction(noteId: string): Promise<{
  success: boolean;
  data: INoteComment[];
  error?: string;
}> {
  try {
    const result = await getCommentsByNoteService(noteId);

    return {
      success: result.success,
      data: result.data ?? [],
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: getErrorMessage(error, "Failed to load comments"),
    };
  }
}

export async function addCommentAction(
  noteId: string,
  content: string,
  parentId?: string
): Promise<{
  success: boolean;
  data?: INoteComment;
  error?: string;
}> {
  try {
    if (!content.trim()) {
      return { success: false, error: "Comment cannot be empty" };
    }

    const result = await createCommentService({
      noteId,
      content: content.trim(),
      parentId,
    });

    return {
      success: result.success,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to post comment"),
    };
  }
}

export async function deleteCommentAction(commentId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await deleteCommentService(commentId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to delete comment"),
    };
  }
}

export async function toggleCommentLikeAction(commentId: string): Promise<{
  success: boolean;
  isLiked?: boolean;
  likeCount?: number;
  error?: string;
}> {
  try {
    const result = await toggleCommentLikeService(commentId);

    return {
      success: result.success,
      isLiked: result.data.isLiked,
      likeCount: result.data.likeCount,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to update comment like"),
    };
  }
}

export async function getNoteByIdAction(noteId: string): Promise<{
  success: boolean;
  data?: INote;
  error?: string;
}> {
  try {
    const result = await getNoteByIdService(noteId);

    return {
      success: result.success,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load note"),
    };
  }
}
