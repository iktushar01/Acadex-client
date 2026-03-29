"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IFavoriteNoteItem } from "@/types/note.types";

const getErrorMessage = (error: unknown, fallback: string): string => {
  const maybeAxios = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return maybeAxios?.response?.data?.message ?? maybeAxios?.message ?? fallback;
};

export const getMyFavoritesAction = async (): Promise<{
  success: boolean;
  data: IFavoriteNoteItem[];
  error?: string;
}> => {
  try {
    const result = await httpClient.get<IFavoriteNoteItem[]>("/favorites");

    return {
      success: result.success,
      data: result.data ?? [],
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: getErrorMessage(error, "Failed to load favorites"),
    };
  }
};
