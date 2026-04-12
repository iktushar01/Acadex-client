"use server";

import { uploadCoverLogoService } from "@/services/coverPage/coverPage.service";

export const uploadCoverLogoAction = async (formData: FormData) => {
  try {
    const file = formData.get("logo");
    if (!file || !(file instanceof File)) {
      return { success: false as const, error: "A logo image file is required" };
    }

    const outbound = new FormData();
    outbound.append("logo", file);

    const response = await uploadCoverLogoService(outbound);

    if (response.success && response.data) {
      return { success: true as const, data: response.data, message: response.message };
    }

    return {
      success: false as const,
      error: response.message || "Failed to upload logo",
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false as const,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to upload logo",
    };
  }
};
