"use server";

import { createFolder, deleteFolder, updateFolder } from "@/services/classroomSubjectFolder/crudFolder.service";
import { ICreateFolderPayload, IUpdateFolderPayload } from "@/types/classroomSubjectFolder..types";
import { revalidatePath } from "next/cache";

export const createFolderAction = async (data: ICreateFolderPayload) => {
  try {
    // 1. Basic Validation
    if (!data.name || !data.subjectId) {
      return { 
        success: false, 
        error: "Folder name and Subject ID are required" 
      };
    }

    // 2. Call Service
    const response = await createFolder(data);

    if (response.success) {
      revalidatePath(`/dashboard/classroom/subject/${data.subjectId}`);
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: response.message || "Failed to create folder",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

export const updateFolderAction = async (data: IUpdateFolderPayload) => {
  try {
    if (!data.folderId) {
      return {
        success: false,
        error: "Folder ID is required",
      };
    }

    const hasPatchField =
      data.name !== undefined ||
      data.coverImage !== undefined ||
      data.coverImageBase64 !== undefined;

    if (!hasPatchField) {
      return {
        success: false,
        error: "At least one of name, coverImage, or coverImageBase64 must be provided",
      };
    }

    const response = await updateFolder(data);

    if (response.success && response.data) {
      const subjectId = response.data.subjectId;
      if (subjectId) {
        revalidatePath(`/dashboard/classroom/subject/${subjectId}`);
      }
      revalidatePath(`/dashboard/classroom/folder/${data.folderId}`);
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: response.message || "Failed to update folder",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

export const deleteFolderAction = async (
  folderId: string,
  subjectId?: string
) => {
  try {
    if (!folderId) {
      return {
        success: false,
        error: "Folder ID is required",
      };
    }

    const response = await deleteFolder(folderId);

    if (response.success) {
      if (subjectId) {
        revalidatePath(`/dashboard/classroom/subject/${subjectId}`);
      }
      revalidatePath(`/dashboard/classroom/folder/${folderId}`);
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: response.message || "Failed to delete folder",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};