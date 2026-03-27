"use server";

import { createSubject } from "@/services/classroomSubject/crudSubject.service";
import { CreateSubjectInput } from "@/types/classroomSubject.types";
import { revalidatePath } from "next/cache";


export const createSubjectAction = async (data: CreateSubjectInput) => {
  try {
    // 1. Basic Validation
    if (!data.name || !data.classroomId) {
      return { success: false, error: "Subject name and Classroom ID are required" };
    }

    // 2. Call Service
    const response = await createSubject(data);

    if (response.success) {
      // 3. Revalidate the classroom subjects list
      revalidatePath(`/dashboard/classroom/${data.classroomId}`);
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: response.message || "Failed to create subject"
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};
