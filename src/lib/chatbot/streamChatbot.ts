"use client";

import type {
  AskChatbotPayload,
  StreamEvent,
} from "@/types/chatbot.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAccessToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

export async function* streamChatbotAsk(
  payload: AskChatbotPayload,
): AsyncGenerator<StreamEvent> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured");
  }

  const accessToken = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/chatbot/ask/stream`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message || "Failed to reach study assistant",
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Streaming is not supported in this browser");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const data = trimmed.slice(5).trim();
      if (!data) continue;

      try {
        yield JSON.parse(data) as StreamEvent;
      } catch {
        // skip malformed events
      }
    }
  }
}
