import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { setCookie } from "@/lib/cookieUtils";
import { NextRequest, NextResponse } from "next/server";

interface OAuthCompleteBody {
  accessToken?: string;
  refreshToken?: string;
  redirectPath?: string;
  user?: {
    name: string;
    email: string;
    role: string;
    image?: string | null;
  };
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as OAuthCompleteBody;

  if (
    !body.accessToken ||
    !body.refreshToken ||
    !body.user?.role ||
    !body.user?.email ||
    !body.user?.name
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid OAuth payload" },
      { status: 400 },
    );
  }

  const normalizedRole = body.user.role.toUpperCase() as UserRole;
  const targetPath =
    body.redirectPath && isValidRedirectForRole(body.redirectPath, normalizedRole)
      ? body.redirectPath
      : getDefaultDashboardRoute(normalizedRole);

  await setCookie("accessToken", body.accessToken, 24 * 60 * 60);
  await setCookie("refreshToken", body.refreshToken, 7 * 24 * 60 * 60);
  await setCookie(
    "user",
    JSON.stringify({
      name: body.user.name,
      email: body.user.email,
      role: normalizedRole,
      avatar: body.user.image ?? null,
      image: body.user.image ?? null,
    }),
    7 * 24 * 60 * 60,
    false,
  );

  return NextResponse.json({
    success: true,
    redirectTo: targetPath,
  });
}
