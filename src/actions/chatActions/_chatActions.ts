"use server";

import {
  deleteChatMessageService,
  getChatMessagesService,
  sendChatMessageService,
} from "@/services/chat/chat.service";
import type { ChatMessage, ChatMessagesMeta } from "@/types/chat.types";

const getErrorMessage = (error: unknown, fallback: string): string => {
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

export async function getChatMessagesAction(
  classroomId: string,
  options?: { cursor?: string; limit?: number },
): Promise<{
  success: boolean;
  data?: ChatMessage[];
  meta?: ChatMessagesMeta;
  error?: string;
}> {
  try {
    const result = await getChatMessagesService(classroomId, options);

    return {
      success: true,
      data: result.data ?? [],
      meta: result.meta,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to load messages"),
    };
  }
}

export async function sendChatMessageAction(payload: {
  classroomId: string;
  content: string;
}): Promise<{
  success: boolean;
  data?: ChatMessage;
  error?: string;
}> {
  try {
    const result = await sendChatMessageService(payload);

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to send message"),
    };
  }
}

export async function deleteChatMessageAction(messageId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await deleteChatMessageService(messageId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to delete message"),
    };
  }
}
