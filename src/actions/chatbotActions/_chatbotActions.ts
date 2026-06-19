"use server";

import {
  askChatbot,
  getChatHistory,
  reindexClassroomNotes,
} from "@/services/chatbot/chatbot.service";
import { AskChatbotPayload } from "@/types/chatbot.types";

export const askChatbotAction = async (payload: AskChatbotPayload) => {
  try {
    const response = await askChatbot(payload);

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

    const response = await getChatHistory(classroomId);

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

    const response = await reindexClassroomNotes(classroomId);

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
