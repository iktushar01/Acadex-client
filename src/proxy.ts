import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { getNewTokensWithRefreshToken } from "./services/auth/auth.services";
import { UserFromCookie } from "./types/auth.types";

const readUserFromCookie = (request: NextRequest): UserFromCookie | null => {
    const rawUserCookie = request.cookies.get("user")?.value;

    if (!rawUserCookie) {
        return null;
    }

    try {
        return JSON.parse(rawUserCookie) as UserFromCookie;
    } catch (error) {
        console.error("Failed to parse user cookie in proxy:", error);
        return null;
    }
};

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
    try {
        const refresh = await getNewTokensWithRefreshToken(refreshToken);
        if (!refresh) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error refreshing token in middleware:", error);
        return false;
    }
}


export async function proxy(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl; // eg /dashboard, /admin/dashboard, /doctor/dashboard
        const pathWithQuery = `${pathname}${request.nextUrl.search}`;
        const accessToken = request.cookies.get("accessToken")?.value;
        const refreshToken = request.cookies.get("refreshToken")?.value;
        const cookieUser = readUserFromCookie(request);

        const accessTokenSecret =
            process.env.ACCESS_TOKEN_SECRET ?? process.env.JWT_ACCESS_SECRET;

        const decodedAccessToken =
            accessToken && accessTokenSecret
                ? jwtUtils.verifyToken(accessToken, accessTokenSecret).data
                : null;

        const isValidAccessToken =
            accessToken && accessTokenSecret
                ? jwtUtils.verifyToken(accessToken, accessTokenSecret).success
                : false;

        let userRole: UserRole | null = null;

        if (decodedAccessToken) {
            userRole = decodedAccessToken.role as UserRole;
        }

        const routerOwner = getRouteOwner(pathname);

        const unifySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;

        userRole = unifySuperAdminAndAdminRole;

        const isAuth = isAuthRoute(pathname);


        //proactively refresh token if refresh token exists and access token is expired or about to expire
        if (isValidAccessToken && refreshToken && accessToken && (await isTokenExpiringSoon(accessToken))) {
            const requestHeaders = new Headers(request.headers);

            const response = NextResponse.next({
                request: {
                    headers: requestHeaders

                },
            })


            try {
                const refreshed = await refreshTokenMiddleware(refreshToken);

                if (refreshed) {
                    requestHeaders.set("x-token-refreshed", "1");
                }

                return NextResponse.next(
                    {
                        request: {
                            headers: requestHeaders
                        },
                        headers: response.headers
                    }
                )
            } catch (error) {
                console.error("Error refreshing token:", error);

            }

            return response;
        }


        // Rule - 1 : Logged-in users should not access auth pages,
        // except pages that may be mandatory due to account state.
        if (
            isAuth &&
            isValidAccessToken &&
            pathname !== "/verify-email" &&
            pathname !== "/reset-password"
        ) {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
        }

        // Rule - 2 : User is trying to access reset password page
        if (pathname === "/reset-password") {

            const email = request.nextUrl.searchParams.get("email");

            // case - 1 user has needPasswordChange true
            //no need for case 1 if need password change is handled from change-password page
            if (accessToken && email) {
                if (cookieUser?.needPasswordChange) {
                    return NextResponse.next();
                } else {
                    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
                }
            }

            // Case-2 user coming from forgot password

            if (email) {
                return NextResponse.next();
            }

            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathWithQuery);
            return NextResponse.redirect(loginUrl);
        }

        // Rule-3 User trying to access Public route -> allow
        if (routerOwner === null) {
            return NextResponse.next();
        }

        // Rule - 4 User is Not logged in but trying to access protected route -> redirect to login
        if (!accessToken || !isValidAccessToken) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathWithQuery);
            return NextResponse.redirect(loginUrl);
        }

        //Rule - Enforcing user to stay in reset password or verify email page if their needPasswordChange or isEmailVerified flags are not satisfied respectively

        if (accessToken && cookieUser) {
            // Use the locally stored auth snapshot so navigation does not wait on an extra backend call.
            if (cookieUser.emailVerified === false) {
                if (pathname !== "/verify-email") {
                    const verifyEmailUrl = new URL("/verify-email", request.url);
                    verifyEmailUrl.searchParams.set("email", cookieUser.email);
                    return NextResponse.redirect(verifyEmailUrl);
                }

                return NextResponse.next();
            }

            if (cookieUser.emailVerified && pathname === "/verify-email") {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
            }

            if (cookieUser.needPasswordChange) {
                if (pathname !== "/reset-password") {
                    const resetPasswordUrl = new URL("/reset-password", request.url);
                    resetPasswordUrl.searchParams.set("email", cookieUser.email);
                    return NextResponse.redirect(resetPasswordUrl);
                }

                return NextResponse.next();
            }

            if (cookieUser.needPasswordChange === false && pathname === "/reset-password") {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
            }
        }

        // Rule - 5 User trying to access Common protected route -> allow
        if (routerOwner === "COMMON") {
            return NextResponse.next();
        }

        //Rule-6 User trying to visit role based protected but doesn't have required role -> redirect to their default dashboard

        if (routerOwner === "ADMIN" || routerOwner === "STUDENT") {
            if (routerOwner !== userRole) {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
            }
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Error in proxy middleware:", error);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ]
}
