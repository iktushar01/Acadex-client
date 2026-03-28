"use server";

import { createFolder } from "@/services/classroomSubjectFolder/createFolder.service";
import { ICreateFolderPayload } from "@/types/classroomSubjectFolder..types";
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
      // 3. Revalidate the specific subject page to show the new folder
      revalidatePath(`/dashboard/subject/${data.subjectId}`);
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