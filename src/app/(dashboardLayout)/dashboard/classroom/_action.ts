"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export const joinClassroomAction = async (joinCode: string): Promise<ApiResponse<any>> => {
  try {
    const response = await httpClient.post<any>("/classrooms/join", { joinCode });
    return {
      success: true,
      data: response.data,
      message: "Successfully joined the classroom!",
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Invalid join code",
    };
  }
};