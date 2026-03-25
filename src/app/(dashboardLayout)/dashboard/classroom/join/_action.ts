"use server";

import { cookies } from "next/headers";

export async function joinClassroomAction(joinCode: string) {
  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

    if (!apiBaseUrl) {
      return {
        success: false,
        message: "API base URL is not configured.",
      };
    }

    // 1. Forward Required Cookies (Better Auth + Access Token)
    const cookieStore = await cookies();
    const betterAuthSessionToken = cookieStore.get("better-auth.session_token")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;

    const cookieParts = [
      betterAuthSessionToken ? `better-auth.session_token=${betterAuthSessionToken}` : null,
      accessToken ? `accessToken=${accessToken}` : null,
    ].filter(Boolean) as string[];

    const cookieHeader = cookieParts.join("; ");

    if (!cookieHeader) {
      return {
        success: false,
        message: "Authentication required. Please log in.",
      };
    }

    // 2. Execute Join Request to the Dynamic URL
    const response = await fetch(`${apiBaseUrl}/classrooms/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader, // Send as Cookie header instead of Authorization
      },
      body: JSON.stringify({ joinCode }),
      cache: "no-store",
    });

    const result = await response.json();

    // 3. Handle Errors with the same robust logic as your Create Action
    if (!response.ok) {
      return {
        success: false,
        message: result?.message || "Invalid access code or classroom full.",
      };
    }

    return {
      success: true,
      data: result.data, 
      message: "Connection established successfully.",
    };
  } catch (error) {
    console.error("JOIN_CLASS_ERROR:", error);
    return {
      success: false,
      message: "Node communication failure. Check your uplink.",
    };
  }
}