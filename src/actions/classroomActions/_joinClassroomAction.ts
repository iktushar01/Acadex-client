"use server";

import { joinClassroomService } from "@/services/classroom/joinClassroom.service";
import axios from "axios";

export async function joinClassroomAction(joinCode: string) {
  try {
    // Basic client-side validation
    if (!joinCode || joinCode.trim().length === 0) {
      return { success: false, message: "Please enter a valid access code." };
    }

    const response = await joinClassroomService.join(joinCode);

    return {
      success: true,
      data: response.data,
      message: response.message || "Connection established successfully.",
    };

  } catch (error: any) {
    console.error("JOIN_CLASS_ERROR:", error);

    // Handle Axios/API errors
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid access code or classroom full.",
      };
    }

    // Generic fallback
    return {
      success: false,
      message: "Node communication failure. Check your uplink.",
    };
  }
}