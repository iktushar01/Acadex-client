"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export const logoutAction = async (): Promise<{ success: boolean }> => {
  try {
    await httpClient.post("/auth/logout", {});
  } catch (error: any) {
    console.error("BACKEND_LOGOUT_ERROR:", error.message);
    // Still clear cookies even if backend call fails
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("better-auth.session_token");
    cookieStore.delete("user");
  }

  // ✅ Do NOT call redirect() here — it throws internally and kills onSuccess.
  // Let the client handle navigation after this returns.
  return { success: true };
};