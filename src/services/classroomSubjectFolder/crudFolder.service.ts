"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { ICreateFolderPayload, IFolderResponse, IUpdateFolderPayload } from "@/types/classroomSubjectFolder..types";

/**
 * Communicates with POST /folders
 * Sends the payload (including base64 image) to the backend
 */
export const createFolder = async (
  data: ICreateFolderPayload
): Promise<ApiResponse<IFolderResponse>> => {
  return await httpClient.post<IFolderResponse>("/folders", data);
};

export const updateFolder = async (
  data: IUpdateFolderPayload
): Promise<ApiResponse<IFolderResponse>> => {
  const { folderId, ...body } = data;
  return await httpClient.patch<IFolderResponse>(`/folders/${folderId}`, body);
};

export const deleteFolder = async (
  folderId: string
): Promise<ApiResponse<IFolderResponse>> => {
  return await httpClient.delete<IFolderResponse>(`/folders/${folderId}`);
};
