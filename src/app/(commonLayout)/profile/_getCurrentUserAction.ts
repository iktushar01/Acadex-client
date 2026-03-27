"use server";

import { cookies } from "next/headers";
import { ApiResponse } from "@/types/api.types";

/**
 * Interface representing the specific structure of your User data
 * Based on your provided JSON result
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: "STUDENT" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  image: string;
  createdAt: string;
  student?: {
    id: string;
    profilePhoto: string;
    contactNumber: string | null;
    address: string | null;
    gender: string | null;
  };
}

/**
 * Fetches the current user profile from the backend.
 * Uses the httpOnly cookies automatically via httpClient.
 */
export const getCurrentUserAction = async (): Promise<ApiResponse<UserProfile> | { success: false; data: any; message: string }> => {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;

    if (!userCookie) {
      throw new Error("User cookie is missing.");
    }

    const user = JSON.parse(userCookie);

    return {
      success: true,
      data: user,
      message: "Profile loaded from cookies",
    };
  } catch (error: any) {
    console.error("FETCH_USER_ERROR:", error.message);

    return {
      success: false,
      data: null as any,
      message: error.message || "Failed to load profile. Please log in again.",
    };
  }
};