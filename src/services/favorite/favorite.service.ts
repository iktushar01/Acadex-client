import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";

export interface IFavoriteStatusResponse {
  noteId: string;
  isFavorited: boolean;
}

export const getFavoriteStatusService = async (
  noteId: string
): Promise<ApiResponse<IFavoriteStatusResponse>> => {
  return httpClient.get<IFavoriteStatusResponse>(`/favorites/check/${noteId}`);
};

export const toggleFavoriteService = async (
  noteId: string
): Promise<ApiResponse<IFavoriteStatusResponse>> => {
  return httpClient.post<IFavoriteStatusResponse>(`/favorites/${noteId}`, {});
};
