import { httpClient } from "@/lib/axios/httpClient";
import { CreateSubjectInput, Subject } from "@/types/classroomSubject.types";
import { ApiResponse } from "@/types/api.types";

/**
 * Communicates with POST /subjects
 */
export const createSubject = async (
  data: CreateSubjectInput
): Promise<ApiResponse<Subject>> => {
  return await httpClient.post<Subject>("/subjects", data);
};