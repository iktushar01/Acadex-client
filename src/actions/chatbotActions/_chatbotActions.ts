"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  AskChatbotPayload,
  AskChatbotResponse,
  ChatHistoryResponse,
  ReindexClassroomResponse,
} from "@/types/chatbot.types";

export const askChatbotAction = async (payload: AskChatbotPayload) => {
  try {
    const response = await httpClient.post<AskChatbotResponse>("/chatbot/ask", payload, {
      timeout: 120_000,
    });

    if (response.success) {
      return { success: true as const, data: response.data, message: response.message };
    }

    return {
      success: false as const,
      error: response.message || "Failed to get an answer",
    };
  } catch (error: any) {
    return {
      success: false as const,
      error: error.response?.data?.message || "Failed to reach study assistant",
    };
  }
};

export const getChatHistoryAction = async (classroomId: string) => {
  try {
    if (!classroomId) {
      return { success: false as const, error: "Classroom ID is required" };
    }

    const response = await httpClient.get<ChatHistoryResponse>(
      `/chatbot/history/${classroomId}`,
    );

    if (response.success) {
      return { success: true as const, data: response.data };
    }

    return {
      success: false as const,
      error: response.message || "Failed to load chat history",
    };
  } catch (error: any) {
    return {
      success: false as const,
      error: error.response?.data?.message || "Failed to load chat history",
    };
  }
};

export const reindexClassroomNotesAction = async (classroomId: string) => {
  try {
    if (!classroomId) {
      return { success: false as const, error: "Classroom ID is required" };
    }

    const response = await httpClient.post<ReindexClassroomResponse>(
      `/chatbot/reindex/${classroomId}`,
      {},
      { timeout: 300_000 },
    );

    if (response.success) {
      return {
        success: true as const,
        data: response.data,
        message: response.message,
      };
    }

    return {
      success: false as const,
      error: response.message || "Failed to reindex notes",
    };
  } catch (error: any) {
    return {
      success: false as const,
      error: error.response?.data?.message || "Failed to reindex notes",
    };
  }
};
