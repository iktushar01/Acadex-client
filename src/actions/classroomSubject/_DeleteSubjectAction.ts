"use server";

import { deleteSubject } from "@/services/classroomSubject/crudSubject.service";
import { revalidatePath } from "next/cache";
import { getCookie } from "@/lib/cookieUtils";

export const deleteSubjectAction = async (subjectId: string, classroomId: string) => {
  if (!subjectId || !classroomId) {
    return { success: false, error: "Missing required IDs." };
  }

  try {
    const user = await getCookie("user");
    
    // Ensure we have a valid user ID from your cookie helper
    if (!user || !user) {
      return { success: false, error: "You must be logged in to perform this action." };
    }

    // Call the service directly (Prisma logic)
    const response = await deleteSubject(subjectId);

    // Revalidate the specific classroom paths
    revalidatePath(`/dashboard/classroom/${classroomId}/subjects`);
    revalidatePath(`/dashboard/classroom/${classroomId}`, "layout");
    
    return { 
      success: true, 
      message: `Subject "${response.data.name}" deleted successfully.`,
      data: response 
    };

  } catch (error: any) {
    console.error(`[DELETE_SUBJECT_ACTION]:`, error);
    return { 
      success: false, 
      error: error.message || "Failed to delete subject." 
    };
  }
};