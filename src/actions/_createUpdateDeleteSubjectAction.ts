"use server";

import { createSubject, deleteSubject, updateSubject } from "@/services/classroomSubject/crudSubject.service";
import { CreateSubjectInput, UpdateSubjectInput } from "@/types/classroomSubject.types";
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



export const updateSubjectAction = async (id: string, data: UpdateSubjectInput, classroomId: string) => {
  try {
    const response = await updateSubject(id, data);
    if (response.success) {
      revalidatePath(`/dashboard/classroom/${classroomId}`);
      return { success: true };
    }
    return { success: false, error: response.message };
  } catch (error: any) {
    return { success: false, error: "Update failed" };
  }
};

export const deleteSubjectAction = async (id: string, classroomId: string) => {
  try {
    const response = await deleteSubject(id);
    if (response.success) {
      revalidatePath(`/dashboard/classroom/${classroomId}`);
      return { success: true };
    }
    return { success: false, error: response.message };
  } catch (error: any) {
    return { success: false, error: "Delete failed" };
  }
};