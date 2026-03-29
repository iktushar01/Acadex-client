"use server";

import { getClassroomLeaderboardById } from "@/services/classroom/getClassroomLeaderboardById.service";

export const getClassroomLeaderboardByIdAction = async (classroomId: string) => {
  try {
    const response = await getClassroomLeaderboardById(classroomId);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    }

    return {
      success: false,
      data: null,
      message: response.message || "Failed to fetch classroom leaderboard.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Failed to fetch classroom leaderboard.",
    };
  }
};
