"use server";

import {
  getCurrentNoticeService,
  toggleNoticeService,
  updateNoticeService,
} from "@/services/notice/notice.service";

export const getCurrentNoticeAction = async () => {
  try {
    const response = await getCurrentNoticeService();
    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error: unknown) {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      data: null,
      error:
        maybeAxiosError.response?.data?.message ||
        maybeAxiosError.message ||
        "Failed to load notice",
    };
  }
};

export const updateNoticeAction = async (content: string) => {
  try {
    const response = await updateNoticeService(content);
    return {
      success: true,
      data: response.data,
      message: response.message || "Notice saved successfully",
    };
  } catch (error: unknown) {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      data: null,
      message:
        maybeAxiosError.response?.data?.message ||
        maybeAxiosError.message ||
        "Failed to save notice",
    };
  }
};

export const toggleNoticeAction = async (isActive: boolean) => {
  try {
    const response = await toggleNoticeService(isActive);
    return {
      success: true,
      data: response.data,
      message: response.message || "Notice status updated successfully",
    };
  } catch (error: unknown) {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      data: null,
      message:
        maybeAxiosError.response?.data?.message ||
        maybeAxiosError.message ||
        "Failed to update notice status",
    };
  }
};
