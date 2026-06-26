import type { ApiResponse } from "@/types/api.types";
import { directApi } from "@/lib/directApi";
import {
  ChatMessage,
  ChatMessagesMeta,
  SendChatMessagePayload,
} from "@/types/chat.types";

export const sendChatMessageClient = async (
  payload: SendChatMessagePayload,
): Promise<ApiResponse<ChatMessage, undefined>> => {
  return directApi<ChatMessage, undefined>("/chat/send", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export type ChatMessagesResponse = ApiResponse<ChatMessage[], ChatMessagesMeta>;

export const getChatMessagesClient = async (
  classroomId: string,
  options?: { cursor?: string; limit?: number },
): Promise<ChatMessagesResponse> => {
  const params = new URLSearchParams({ classroomId });
  if (options?.cursor) params.set("cursor", options.cursor);
  if (options?.limit) params.set("limit", String(options.limit));

  return directApi<ChatMessage[], ChatMessagesMeta>(
    `/chat/messages?${params.toString()}`,
  );
};

export const deleteChatMessageClient = async (
  messageId: string,
): Promise<ApiResponse<{ id: string; classroomId: string }, undefined>> => {
  return directApi<{ id: string; classroomId: string }, undefined>(
    `/chat/${messageId}`, {
    method: "DELETE",
  });
};

export const classroomChannelName = (classroomId: string) =>
  `classroom-${classroomId}`;
