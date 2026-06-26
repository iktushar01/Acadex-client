"use server";

import { ApiResponse } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      message: "API base URL is not configured",
      data: { url: "", sessionId: "" },
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/donations/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInCents }),
    });

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
      message: "Unable to connect to payment service. Please try again.",
      data: { url: "", sessionId: "" },
    };
  }
}
