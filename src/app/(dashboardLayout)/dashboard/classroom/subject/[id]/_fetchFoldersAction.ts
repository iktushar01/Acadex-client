"use server";

import { getFoldersBySubject } from "@/services/subjectFolder";

export const fetchFoldersAction = async (subjectId: string) => {
  try {
    if (!subjectId) return { success: false, error: "Subject ID is required" };

    const response = await getFoldersBySubject(subjectId);

    if (response.success) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.message || "Failed to fetch folders" };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred"
    };
  }
};