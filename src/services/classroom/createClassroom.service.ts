import { httpClient } from "@/lib/axios/httpClient";
import { Classroom } from "@/types/classroom.types";
import { createClassValidation } from "@/zod/classroom.validation";
import { z } from "zod";

/**
 * Create Classroom Service
 * Handles the initialization of new classroom nodes on the Acadex Grid.
 */
export const createClassroomService = {
  /**
   * Creates a new classroom.
   * @param values - Data conforming to createClassValidation schema.
   * @returns The data portion of the API response.
   */
  async create(values: z.infer<typeof createClassValidation>): Promise<Classroom> {
    // 1. Internal Validation 
    // This acts as a final guard before the data leaves the server.
    const validatedData = createClassValidation.parse(values);

    // 2. API Request
    // httpClient automatically attaches Authorization headers and Cookies.
    const response = await httpClient.post<Classroom>("/classrooms", validatedData);

    // 3. Return the specific data
    // Because httpClient returns ApiResponse<Classroom>, we return .data 
    // to keep the Server Action logic simple.
    return response.data;
  }
};