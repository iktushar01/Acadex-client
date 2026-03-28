"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { ICreateFolderPayload, IFolderResponse } from "@/types/classroomSubjectFolder..types";

/**
 * Communicates with POST /folders
 * Sends the payload (including base64 image) to the backend
 */
export const createFolder = async (
  data: ICreateFolderPayload
): Promise<ApiResponse<IFolderResponse>> => {
  return await httpClient.post<IFolderResponse>("/folders", data);
};