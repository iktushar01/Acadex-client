"use server";

import { getClassroomLeaderboard } from "@/services/classroom/getClassroomLeaderboard.service";

export const getClassroomLeaderboardAction = async () => {
  try {
    const response = await getClassroomLeaderboard();

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    }

    return {
      success: false,
      data: [],
      message: response.message || "Failed to fetch leaderboard.",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch leaderboard.";

    return {
      success: false,
      data: [],
      message,
    };
  }
};
