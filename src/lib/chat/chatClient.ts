import { ApiResponse, PaginationMeta } from "@/types/api.types";
import {
  ChatMessage,
  ChatMessagesMeta,
  SendChatMessagePayload,
} from "@/types/chat.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

const getAccessToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

const chatFetch = async <TData, TMeta = PaginationMeta>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<TData, TMeta>> => {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const headers = new Headers(options.headers);
  const accessToken = getAccessToken();

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const payload = (await response.json().catch(() => ({}))) as ApiResponse<
    TData,
    TMeta
  >;

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload;
};

export const sendChatMessageClient = async (
  payload: SendChatMessagePayload,
): Promise<ApiResponse<ChatMessage>> => {
  return chatFetch<ChatMessage>("/chat/send", {
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

  return chatFetch<ChatMessage[], ChatMessagesMeta>(
    `/chat/messages?${params.toString()}`,
  );
};

export const deleteChatMessageClient = async (
  messageId: string,
): Promise<ApiResponse<{ id: string; classroomId: string }>> => {
  return chatFetch<{ id: string; classroomId: string }>(`/chat/${messageId}`, {
    method: "DELETE",
  });
};

export const classroomChannelName = (classroomId: string) =>
  `classroom-${classroomId}`;
