import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  AskChatbotPayload,
  AskChatbotResponse,
  ChatHistoryResponse,
  ReindexClassroomResponse,
} from "@/types/chatbot.types";

export const askChatbot = async (
  payload: AskChatbotPayload,
): Promise<ApiResponse<AskChatbotResponse>> => {
  return httpClient.post<AskChatbotResponse>("/chatbot/ask", payload, {
    timeout: 120_000,
  });
};

export const getChatHistory = async (
  classroomId: string,
): Promise<ApiResponse<ChatHistoryResponse>> => {
  return httpClient.get<ChatHistoryResponse>(`/chatbot/history/${classroomId}`);
};

export const reindexClassroomNotes = async (
  classroomId: string,
): Promise<ApiResponse<ReindexClassroomResponse>> => {
  return httpClient.post<ReindexClassroomResponse>(
    `/chatbot/reindex/${classroomId}`,
    {},
    { timeout: 300_000 },
  );
};
