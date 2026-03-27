import { httpClient } from "@/lib/axios/httpClient";
import { Classroom } from "@/types/classroom.types";
import { createClassValidation } from "@/zod/classroom.validation";
import { z } from "zod";

export const classroomService = {
  /**
   * Creates a new classroom on the Acadex Grid.
   */
  async create(values: z.infer<typeof createClassValidation>) {
    // 1. Zod Validation (Optional here if you trust the Action, but good for safety)
    const validatedData = createClassValidation.parse(values);

    // 2. Request using your helper
    // The httpClient handles BaseURL, Cookies, and Auth headers automatically.
    const response = await httpClient.post<Classroom>("/classrooms", validatedData);

    // 3. Return the typed data
    return response.data;
  }
};