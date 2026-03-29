import { httpClient } from "@/lib/axios/httpClient";
import type { Notice } from "@/types/notice.types";

export const getCurrentNoticeService = async () => {
  return httpClient.get<Notice | null>("/notices/current");
};

export const updateNoticeService = async (content: string) => {
  return httpClient.patch<Notice>("/notices/current", { content });
};

export const toggleNoticeService = async (isActive: boolean) => {
  return httpClient.patch<Notice>("/notices/current/toggle", { isActive });
};
