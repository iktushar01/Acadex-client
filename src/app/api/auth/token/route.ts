import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Returns the access token from httpOnly cookies so the browser can call the
 * API directly (one network hop) instead of routing every request through a
 * Server Action (two hops).
 */
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  return NextResponse.json(
    { success: true, accessToken },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
