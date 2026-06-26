import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  ChatMessage,
  ChatMessagesMeta,
  SendChatMessagePayload,
} from "@/types/chat.types";

export type ChatMessagesResponse = ApiResponse<ChatMessage[], ChatMessagesMeta>;

export const getChatMessagesService = async (
  classroomId: string,
  options?: { cursor?: string; limit?: number },
): Promise<ChatMessagesResponse> => {
  const params: Record<string, unknown> = { classroomId };
  if (options?.cursor) params.cursor = options.cursor;
  if (options?.limit) params.limit = options.limit;

  return httpClient.get<ChatMessage[]>("/chat/messages", {
    params,
  }) as Promise<ChatMessagesResponse>;
};

export const sendChatMessageService = async (
  payload: SendChatMessagePayload,
): Promise<ApiResponse<ChatMessage>> => {
  return httpClient.post<ChatMessage>("/chat/send", payload);
};

export const deleteChatMessageService = async (
  messageId: string,
): Promise<ApiResponse<{ id: string; classroomId: string }>> => {
  return httpClient.delete<{ id: string; classroomId: string }>(
    `/chat/${messageId}`,
  );
};
