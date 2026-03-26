import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { Subject } from "@/types/classroomSubject.types";

export const getSubjectsByClassroom = async (classroomId: string): Promise<ApiResponse<Subject[]>> => {
  // endpoint: /subjects?classroomId=...
  return await httpClient.get<Subject[]>(`/subjects`, {
    params: { classroomId }
  });
};