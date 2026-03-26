"use server";

import { createClassValidation } from "@/zod/classroom.validation";
import { z } from "zod";
import { getCookie } from "@/lib/cookieUtils";

export async function createClassroomAction(values: z.infer<typeof createClassValidation>) {
  try {
    // 1. Validate the schema
    const validatedData = createClassValidation.parse(values);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

    if (!apiBaseUrl) {
      return { success: false, message: "API base URL is not configured." };
    }

    // 2. Use your utility to get tokens
    const sessionToken = await getCookie("better-auth.session_token");
    const accessToken = await getCookie("accessToken");

    // 3. Build the cookie header string
    const cookieParts = [
      sessionToken ? `better-auth.session_token=${sessionToken}` : null,
      accessToken ? `accessToken=${accessToken}` : null,
    ].filter(Boolean) as string[];
    
    const cookieHeader = cookieParts.join("; ");

    // 4. Execute the fetch
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

    // 5. Handle Error Responses
    if (!response.ok) {
      const errorSources = result?.errorSources;
      const fallbackIssues = result?.error;
      
      const errorDetail = errorSources?.length
        ? `Validation failed: ${errorSources.map((e: any) => `${e.path || "field"}: ${e.message}`).join(", ")}`
        : fallbackIssues?.length
          ? `Validation failed: ${fallbackIssues.map((e: any) => `${(e.path || []).join(".")}: ${e.message}`).join(", ")}`
          : result?.message || "Validation failed";

      return { success: false, message: errorDetail };
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
      message: error instanceof z.ZodError 
        ? "Invalid configuration parameters." 
        : "Internal System Failure.",
    };
  }
}