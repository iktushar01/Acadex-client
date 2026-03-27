"use server";

import { joinClassroomService } from "@/services/classroom/joinClassroom.service";
import axios from "axios";

export async function joinClassroomAction(joinCode: string) {
  try {
    if (!joinCode || joinCode.trim().length === 0) {
      return { success: false, message: "Please enter an access code." };
    }

    const response = await joinClassroomService.join(joinCode);

    return {
      success: true,
      data: response.data,
      message: response.message || "Classroom joined successfully.",
    };

  } catch (error: any) {
    console.error("error in join classroom action", error);

    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid access code or classroom full.",
      };
    }

    return {
      success: false,
      message: "Failed to join classroom",
    };
  }
}