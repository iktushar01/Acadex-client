"use server";

import { updateSubject } from "@/services/classroomSubject/crudSubject.service";
import { UpdateSubjectInput } from "@/types/classroomSubject.types";
import { revalidatePath } from "next/cache";

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