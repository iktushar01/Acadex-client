import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { Classroom } from "@/types/classroom.types";
import { joinClassValidation } from "@/zod/classroom.validation";

/**
 * Join Classroom Service
 * Specifically handles the logic for a user connecting to an existing 
 * classroom via an access code on the Acadex Grid.
 */
export const joinClassroomService = {
  /**
   * Connects the current user to a classroom.
   * * @param joinCode - The unique alphanumeric code for the classroom.
   * @returns Promise<ApiResponse<Classroom>> - The joined classroom data.
   */
  async join(joinCode: string): Promise<ApiResponse<Classroom>> {
    // 1. Validate the input using the Zod schema
    // This ensures the joinCode meets length/format requirements before the API call.
    const normalizedJoinCode = joinCode.trim().toUpperCase();
    const validated = joinClassValidation.parse({ joinCode: normalizedJoinCode });

    // 2. Execute Request
    // The httpClient handles: Base URL, Cookies, and Bearer Tokens automatically.
    return await httpClient.post<Classroom>("/classrooms/join", {
      joinCode: validated.joinCode,
    });
  },
};
