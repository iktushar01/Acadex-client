import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { INoteComment } from "@/types/note-detail.types";

export interface ICreateCommentPayload {
  noteId: string;
  content: string;
  parentId?: string;
}

export interface IToggleCommentLikeResponse {
  isLiked: boolean;
  commentId: string;
  likeCount: number;
}

export interface IDeleteCommentResponse {
  id: string;
  noteId: string;
  wasReply: boolean;
  deletedRepliesCount: number;
}

export const getCommentsByNoteService = async (
  noteId: string
): Promise<ApiResponse<INoteComment[]>> => {
  return httpClient.get<INoteComment[]>(`/comments/${noteId}`);
};

export const createCommentService = async (
  payload: ICreateCommentPayload
): Promise<ApiResponse<INoteComment>> => {
  return httpClient.post<INoteComment>("/comments", payload);
};

export const deleteCommentService = async (
  commentId: string
): Promise<ApiResponse<IDeleteCommentResponse>> => {
  return httpClient.delete<IDeleteCommentResponse>(`/comments/${commentId}`);
};

export const toggleCommentLikeService = async (
  commentId: string
): Promise<ApiResponse<IToggleCommentLikeResponse>> => {
  return httpClient.post<IToggleCommentLikeResponse>(
    `/comments/${commentId}/like`,
    {}
  );
};
