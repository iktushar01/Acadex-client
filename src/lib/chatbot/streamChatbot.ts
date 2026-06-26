"use client";

import type {
  AskChatbotPayload,
  StreamEvent,
} from "@/types/chatbot.types";

export async function* streamChatbotAsk(
  payload: AskChatbotPayload,
): AsyncGenerator<StreamEvent> {
  const response = await fetch("/api/chatbot/ask/stream", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
