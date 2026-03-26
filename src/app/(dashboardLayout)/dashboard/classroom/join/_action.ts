"use server";

import { getCookie } from "@/lib/cookieUtils";

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

    // 1. Fetch tokens using your utility functions
    const sessionToken = await getCookie("better-auth.session_token");
    const accessToken = await getCookie("accessToken");

    // 2. Build the Cookie Header
    const cookieParts = [
      sessionToken ? `better-auth.session_token=${sessionToken}` : null,
      accessToken ? `accessToken=${accessToken}` : null,
    ].filter(Boolean) as string[];

    const cookieHeader = cookieParts.join("; ");

    if (!cookieHeader) {
      return {
        success: false,
        message: "Authentication required. Please log in.",
      };
    }

    // 3. Execute Join Request
    const response = await fetch(`${apiBaseUrl}/classrooms/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader,
      },
      body: JSON.stringify({ joinCode }),
      cache: "no-store",
    });

    const result = await response.json();

    // 4. Handle Response
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