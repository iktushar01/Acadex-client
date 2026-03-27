"use server";

import { getSubjectById } from "@/services/classroomSubject/crudSubject.service";

export const fetchSubjectByIdAction = async (subjectId: string) => {
  try {
    if (!subjectId) {
      return { success: false, error: "Subject ID is required" };
    }

    const response = await getSubjectById(subjectId);

    if (response.success) {
      return { success: true, data: response.data };
    }

    return { success: false, error: response.message || "Failed to fetch subject" };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};
