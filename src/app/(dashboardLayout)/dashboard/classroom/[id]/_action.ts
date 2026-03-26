"use server";

import { getSubjectsByClassroom } from "@/services/classroomSubject";

export const fetchSubjectsAction = async (classroomId: string) => {
  try {
    if (!classroomId) return { success: false, error: "Classroom ID is required" };

    const response = await getSubjectsByClassroom(classroomId);
    
    if (response.success) {
      return { success: true, data: response.data };
    }
    
    return { success: false, error: response.message || "Failed to fetch subjects" };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || "An unexpected error occurred" 
    };
  }
};