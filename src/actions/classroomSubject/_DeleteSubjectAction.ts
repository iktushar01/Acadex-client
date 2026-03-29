"use server";

import { deleteSubject } from "@/services/classroomSubject/crudSubject.service";
import { revalidatePath } from "next/cache";

export const deleteSubjectAction = async (subjectId: string, classroomId: string) => {
  if (!subjectId || !classroomId) {
    return { success: false, error: "Missing required IDs." };
  }

  try {
    const response = await deleteSubject(subjectId);

    revalidatePath(`/dashboard/classroom/${classroomId}/subjects`);
    revalidatePath(`/dashboard/classroom/${classroomId}`, "layout");
    
    return { 
      success: true, 
      message: `Subject "${response.data.name}" deleted successfully.`,
      data: response 
    };

  } catch (error: unknown) {
    console.error(`[DELETE_SUBJECT_ACTION]:`, error);

    const maybeAxiosError = error as {
      response?: { data?: { message?: string; error?: string } };
      message?: string;
    };

    const backendMessage =
      maybeAxiosError.response?.data?.message ||
      maybeAxiosError.response?.data?.error ||
      maybeAxiosError.message;

    return { 
      success: false, 
      error: backendMessage || "Failed to delete subject." 
    };
  }
};
