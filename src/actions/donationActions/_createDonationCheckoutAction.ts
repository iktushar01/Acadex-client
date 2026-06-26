"use server";

import { ApiResponse } from "@/types/api.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

interface CheckoutSessionData {
  url: string;
  sessionId: string;
}

export async function createDonationCheckoutAction(
  amountInCents: number,
): Promise<ApiResponse<CheckoutSessionData>> {
  if (!API_BASE_URL) {
    return {
      success: false,
      message:
        "API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL on Vercel.",
      data: { url: "", sessionId: "" },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/donations/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInCents }),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return {
        success: false,
        message:
          response.status >= 500
            ? "Payment service is unavailable. Check server logs and redeploy."
            : `Payment service returned an unexpected response (${response.status}).`,
        data: { url: "", sessionId: "" },
      };
    }

    const result = (await response.json()) as ApiResponse<CheckoutSessionData>;

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || "Failed to start checkout",
        data: { url: "", sessionId: "" },
      };
    }

    return result;
  } catch {
    return {
      success: false,
      message:
        "Unable to reach the payment API. Confirm NEXT_PUBLIC_API_BASE_URL points to your deployed server.",
      data: { url: "", sessionId: "" },
    };
  }
}
