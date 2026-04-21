"use server";

import { uploadCoverLogoService } from "@/services/coverPage/coverPage.service";

export const uploadCoverLogoAction = async (formData: FormData) => {
  try {
    const outbound = new FormData();
    const file = formData.get("logo");
    const logoUrl = formData.get("logoUrl");
    const fileName = formData.get("fileName");

    if (file instanceof File) {
      outbound.append("logo", file);
    } else if (typeof logoUrl === "string" && logoUrl.trim()) {
      outbound.append("logoUrl", logoUrl);
      if (typeof fileName === "string" && fileName.trim()) {
        outbound.append("fileName", fileName);
      }
    } else {
      return { success: false as const, error: "A logo image file or logo URL is required" };
    }

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
