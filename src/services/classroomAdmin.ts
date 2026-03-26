import { getCookie } from "@/lib/cookieUtils";
import { ClassroomFilterValues } from "@/zod/classroom.validation";

// ─── Shared fetch helper ──────────────────────────────────────────────────────

async function classroomFetch(
  path: string,
  options: RequestInit = {},
): Promise<any> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) throw new Error("API base URL is not configured in .env");

  const sessionToken = await getCookie("better-auth.session_token");
  const accessToken = await getCookie("accessToken");

  const cookieHeader = [
    sessionToken ? `better-auth.session_token=${sessionToken}` : null,
    accessToken ? `accessToken=${accessToken}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  const url = `${apiBaseUrl.replace(/\/$/, "")}${path}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> ?? {}),
  };

  // ONLY send Content-Type if we actually have a body
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  // Ensure these are real values and not the string "undefined"
  const hasSession = sessionToken && sessionToken !== "undefined";
  const hasAccess = accessToken && accessToken !== "undefined";

  if (hasSession || hasAccess) {
    const parts = [];
    if (hasSession) parts.push(`better-auth.session_token=${sessionToken}`);
    if (hasAccess) parts.push(`accessToken=${accessToken}`);
    headers["Cookie"] = parts.join("; ");
  }

  if (hasAccess) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const fetchOptions: RequestInit = {
    ...options,
    method: options.method || "GET",
    headers,
    cache: "no-store",
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err: any = new Error(errorData.message || `HTTP Error ${response.status}`);
    err.data = errorData;
    err.status = response.status;
    throw err;
  }

  return response.json();
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const ClassroomService = {
  /**
   * GET /classrooms — paginated list with filters
   */
  async getAll(filters: ClassroomFilterValues) {
    const query = new URLSearchParams();
    
    // Always send page/limit to ensure backend receives a valid query object
    query.append("page", (filters.page || 1).toString());
    query.append("limit", (filters.limit || 10).toString());
    
    if (filters.status) query.append("status", filters.status);
    if (filters.level) query.append("level", filters.level);
    if (filters.searchTerm) query.append("searchTerm", filters.searchTerm);
    if (filters.institutionName) query.append("institutionName", filters.institutionName);

    const qs = query.toString();
    return classroomFetch(`/classrooms?${qs}`);
  },

  /**
   * PATCH /classrooms/:id/approve
   */
  async approve(classroomId: string) {
    return classroomFetch(`/classrooms/${classroomId}/approve`, {
      method: "PATCH",
    });
  },

  /**
   * PATCH /classrooms/:id/reject
   */
  async reject(classroomId: string, rejectionReason: string) {
    return classroomFetch(`/classrooms/${classroomId}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ rejectionReason }),
    });
  },
};