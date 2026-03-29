"use server";

import { joinClassroomService } from "@/services/classroom/joinClassroom.service";
import axios from "axios";

type JoinClassroomError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

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

  } catch (error: unknown) {
    console.error("error in join classroom action", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as JoinClassroomError;

      return {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "Invalid access code or classroom full.",
      };
    }

    return {
      success: false,
      message: "Failed to join classroom",
    };
  }
}
