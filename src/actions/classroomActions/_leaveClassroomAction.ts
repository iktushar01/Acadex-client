"use server";

import { leaveClassroomService } from "@/services/classroom/leaveClassroom.service";

export const leaveClassroomAction = async (classroomId: string) => {
  try {
    const response = await leaveClassroomService(classroomId);

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to leave classroom.",
      };
    }

    return {
      success: true,
      message: response.message || "Successfully left the classroom.",
      data: response.data,
    };
  } catch (error) {
    const message =
      error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;

    return {
      success: false,
      message: message || "Failed to leave classroom.",
    };
  }
};
