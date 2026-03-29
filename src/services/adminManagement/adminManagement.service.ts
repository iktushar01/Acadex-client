"use server";

import { getCookie } from "@/lib/cookieUtils";

export type ManageableAdminRole = "ADMIN" | "SUPER_ADMIN";

export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  contactNumber: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: ManageableAdminRole;
    status: string;
    emailVerified: boolean;
    image: string | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateAdminPayload {
  password: string;
  role: ManageableAdminRole;
  admin: {
    name: string;
    email: string;
    contactNumber?: string;
    profilePhoto?: string;
  };
}

export interface UpdateAdminPayload {
  admin: {
    name?: string;
    contactNumber?: string;
    profilePhoto?: string;
  };
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured in .env");
  }

  const sessionToken = await getCookie("better-auth.session_token");
  const accessToken = await getCookie("accessToken");

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const hasSession = sessionToken && sessionToken !== "undefined";
  const hasAccess = accessToken && accessToken !== "undefined";

  if (hasSession || hasAccess) {
    const parts: string[] = [];
    if (hasSession) parts.push(`better-auth.session_token=${sessionToken}`);
    if (hasAccess) parts.push(`accessToken=${accessToken}`);
    headers["Cookie"] = parts.join("; ");
  }

  if (hasAccess) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(
    `${apiBaseUrl.replace(/\/$/, "")}${path}`,
    {
      ...options,
      method: options.method || "GET",
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(
      errorData.message || `HTTP Error ${response.status}`,
    ) as Error & { data?: unknown; status?: number };
    err.data = errorData;
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export const AdminManagementService = {
  async getAllAdmins() {
    return adminFetch("/admins");
  },

  async createAdmin(payload: CreateAdminPayload) {
    return adminFetch("/users/create-admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateAdmin(adminId: string, payload: UpdateAdminPayload) {
    return adminFetch(`/admins/${adminId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async deleteAdmin(adminId: string) {
    return adminFetch(`/admins/${adminId}`, {
      method: "DELETE",
    });
  },
};
