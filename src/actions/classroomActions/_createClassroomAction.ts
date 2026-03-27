"use server";

import { classroomService } from "@/services/classroom/createClassroom.service";
import { createClassValidation } from "@/zod/classroom.validation";
import { z } from "zod";

export async function createClassroomAction(values: z.infer<typeof createClassValidation>) {
  try {
    const data = await classroomService.create(values);

    return {
      success: true,
      data: data,
      message: "Classroom initialized on the Acadex Grid.",
    };

  } catch (error: any) {
    console.error("Action Error:", error);

    // 1. Handle Zod Errors (Local)
    if (error instanceof z.ZodError) {
      return { success: false, message: "Invalid configuration parameters." };
    }

    // 2. Handle API Error Responses (Thrown from service)
    const errorSources = error?.errorSources;
    const fallbackIssues = error?.error;
    
    const errorDetail = errorSources?.length
      ? `Validation failed: ${errorSources.map((e: any) => `${e.path || "field"}: ${e.message}`).join(", ")}`
      : fallbackIssues?.length
        ? `Validation failed: ${fallbackIssues.map((e: any) => `${(e.path || []).join(".")}: ${e.message}`).join(", ")}`
        : error?.message || "Internal System Failure.";

    return {
      success: false,
      message: errorDetail,
    };
  }
}