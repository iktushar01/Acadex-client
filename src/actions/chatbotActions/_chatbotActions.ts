"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {
  AskChatbotPayload,
  AskChatbotResponse,
  ChatHistoryResponse,
  ChatSessionItem,
  ClassroomIndexStats,
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

export const getChatHistoryAction = async (
  classroomId: string,
  sessionId?: string,
) => {
  try {
    if (!classroomId) {
      return { success: false as const, error: "Classroom ID is required" };
    }

    const response = await httpClient.get<ChatHistoryResponse>(
      `/chatbot/history/${classroomId}`,
      sessionId ? { params: { sessionId } } : undefined,
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

export const listChatSessionsAction = async (classroomId: string) => {
  try {
    const response = await httpClient.get<ChatSessionItem[]>(
      `/chatbot/sessions/${classroomId}`,
    );

    if (response.success) {
      return { success: true as const, data: response.data };
    }

    return {
      success: false as const,
      error: response.message || "Failed to load sessions",
    };
  } catch (error: any) {
    return {
      success: false as const,
      error: error.response?.data?.message || "Failed to load sessions",
    };
  }
};

export const createChatSessionAction = async (payload: {
  classroomId: string;
  title?: string;
}) => {
  try {
    const response = await httpClient.post<{ id: string; title: string | null }>(
      "/chatbot/sessions",
      payload,
    );

    if (response.success) {
      return { success: true as const, data: response.data };
    }

    return {
      success: false as const,
      error: response.message || "Failed to create session",
    };
  } catch (error: any) {
    return {
      success: false as const,
      error: error.response?.data?.message || "Failed to create session",
    };
  }
};

export const clearChatSessionAction = async (sessionId: string) => {
  try {
    const response = await httpClient.delete<{ sessionId: string }>(
      `/chatbot/sessions/${sessionId}/clear`,
    );

    if (response.success) {
      return { success: true as const, data: response.data };
    }

    return {
      success: false as const,
      error: response.message || "Failed to clear chat",
    };
  } catch (error: any) {
    return {
      success: false as const,
      error: error.response?.data?.message || "Failed to clear chat",
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
      { timeout: 30_000 },
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

export const reindexNoteAction = async (noteId: string) => {
  try {
    const response = await httpClient.post<{ queued: boolean; noteId: string; message: string }>(
      `/chatbot/reindex/note/${noteId}`,
      {},
    );

    if (response.success) {
      return { success: true as const, data: response.data, message: response.message };
    }

    return {
      success: false as const,
      error: response.message || "Failed to reindex note",
    };
  } catch (error: any) {
    return {
      success: false as const,
      error: error.response?.data?.message || "Failed to reindex note",
    };
  }
};

export const getClassroomIndexStatsAction = async (classroomId: string) => {
  try {
    const response = await httpClient.get<ClassroomIndexStats>(
      `/chatbot/admin/stats/${classroomId}`,
    );

    if (response.success) {
      return { success: true as const, data: response.data };
    }

    return {
      success: false as const,
      error: response.message || "Failed to load indexing stats",
    };
  } catch (error: any) {
    return {
      success: false as const,
      error: error.response?.data?.message || "Failed to load indexing stats",
    };
  }
};
