"use server";

import { ApiResponse } from "@/types/api.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

export async function confirmDonationAction(sessionId: string) {
  if (!API_BASE_URL) {
    return {
      success: false,
      message: "API base URL is not configured",
      data: null,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/donations/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
      cache: "no-store",
    });

    const result = (await response.json()) as ApiResponse<unknown>;

    return {
      success: response.ok && result.success,
      message: result.message || "Donation confirmed",
      data: result.data ?? null,
    };
  } catch {
    return {
      success: false,
      message: "Unable to confirm donation with the server.",
      data: null,
    };
  }
}
