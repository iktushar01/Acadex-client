import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { Folder } from "@/types/classroomSubject.types";


export const getFoldersBySubject = async (subjectId: string): Promise<ApiResponse<Folder[]>> => {
  return await httpClient.get<Folder[]>(`/folders`, {
    params: { subjectId }
  });
};