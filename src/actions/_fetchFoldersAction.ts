"use server";

import { getFoldersBySubject } from "@/services/classroomSubjectFolder/getFoldersBySubject.service";
import { getFolderById } from "@/services/classroomSubjectFolder/getFolderById.service";

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

export const fetchFolderByIdAction = async (folderId: string) => {
  try {
    if (!folderId) return { success: false as const, error: "Folder ID is required" };

    const response = await getFolderById(folderId);

    if (response.success) {
      return { success: true as const, data: response.data };
    }

    return {
      success: false as const,
      error: response.message || "Failed to load folder",
    };
  } catch (error: any) {
    return {
      success: false as const,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};