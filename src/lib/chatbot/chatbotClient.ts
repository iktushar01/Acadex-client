import { ApiResponse } from "@/types/api.types";
import {
  AskChatbotPayload,
  AskChatbotResponse,
  ChatHistoryResponse,
  ReindexClassroomResponse,
} from "@/types/chatbot.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

const chatbotFetch = async <TData>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<TData>> => {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const payload = (await response.json().catch(() => ({}))) as ApiResponse<TData>;

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
};

export const askChatbotClient = async (
  payload: AskChatbotPayload,
): Promise<ApiResponse<AskChatbotResponse>> => {
  return chatbotFetch<AskChatbotResponse>("/chatbot/ask", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getChatHistoryClient = async (
  classroomId: string,
): Promise<ApiResponse<ChatHistoryResponse>> => {
  return chatbotFetch<ChatHistoryResponse>(`/chatbot/history/${classroomId}`);
};

export const reindexClassroomNotesClient = async (
  classroomId: string,
): Promise<ApiResponse<ReindexClassroomResponse>> => {
  return chatbotFetch<ReindexClassroomResponse>(
    `/chatbot/reindex/${classroomId}`,
    { method: "POST", body: JSON.stringify({}) },
  );
};
