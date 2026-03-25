"use server";

import { createClassValidation } from "@/zod/classroom.validation";
import { cookies } from "next/headers";
import { z } from "zod";

export async function createClassroomAction(values: z.infer<typeof createClassValidation>) {
  try {
    const cookieStore = await cookies();
    
    // 1. Get the 'accessToken' cookie (Adjust the name if your token cookie is named differently)
    // If your token is INSIDE the "user" cookie, you'd parse JSON.parse(cookieStore.get("user").value).accessToken
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized access! No session token provided. Please log in.",
      };
    }

    // 2. Validate input schema
    const validatedData = createClassValidation.parse(values);

    // 3. Request to Backend
    const response = await fetch("http://localhost:5000/api/v1/classrooms", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Injecting the token here
      },
      body: JSON.stringify(validatedData),
      cache: 'no-store'
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || "Deployment failed at the infrastructure level.",
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    console.error("CREATE_CLASS_ACTION_ERROR:", error);
    return {
      success: false,
      message: "System communication failure. Check your connection.",
    };
  }
}