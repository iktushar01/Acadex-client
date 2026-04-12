import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import { CoverLogoUploadData } from "@/types/coverPage.types";

/**
 * POST /cover-pages/logo — multipart field `logo` (image).
 */
export const uploadCoverLogoService = async (
  formData: FormData
): Promise<ApiResponse<CoverLogoUploadData>> => {
  return httpClient.post<CoverLogoUploadData>("/cover-pages/logo", formData, {
    timeout: 120_000,
  });
};
