"use server";

import { createClassValidation } from "@/zod/classroom.validation";
import { z } from "zod";
import { cookies } from "next/headers";

export async function createClassroomAction(values: z.infer<typeof createClassValidation>) {
  try {
    // Validate the schema on the server for security
    const validatedData = createClassValidation.parse(values);

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

    if (!apiBaseUrl) {
      return {
        success: false,
        message: "API base URL is not configured.",
      };
    }

    // Backend auth is cookie-based (Express `checkAuth` middleware),
    // so forward required cookies to the API.
    const cookieStore = await cookies();
    const betterAuthSessionToken = cookieStore.get("better-auth.session_token")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;
    const cookieParts = [
      betterAuthSessionToken
        ? `better-auth.session_token=${betterAuthSessionToken}`
        : null,
      accessToken ? `accessToken=${accessToken}` : null,
    ].filter(Boolean) as string[];
    const cookieHeader = cookieParts.join("; ");

    const response = await fetch(`${apiBaseUrl}/classrooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(validatedData),
      cache: 'no-store'
    });

    const result = await response.json();

    if (!response.ok) {
      const errorSources = result?.errorSources as Array<{ path?: string; message: string }> | undefined;
      const fallbackIssues = result?.error as Array<{ path?: Array<string | number>; message?: string }> | undefined;
      const errorDetail =
        errorSources && errorSources.length
          ? `Validation failed: ${errorSources.map((e) => `${e.path || "field"}: ${e.message}`).join(", ")}`
          : fallbackIssues && fallbackIssues.length
            ? `Validation failed: ${fallbackIssues
                .map((e) => `${(e.path || []).join(".") || "field"}: ${e.message || "Invalid value"}`)
                .join(", ")}`
            : result?.message || "Validation failed";
      return {
        success: false,
        message: errorDetail,
      };
    }

    return {
      success: true,
      data: result.data,
      message: "Classroom initialized on the Acadex Grid.",
    };
  } catch (error) {
    console.error("Action Error:", error);
    return {
      success: false,
      message: error instanceof z.ZodError ? "Invalid configuration parameters." : "Internal System Failure.",
    };
  }
}