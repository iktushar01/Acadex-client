"use client";

import type { ApiResponse } from "@/types/api.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

let cachedToken: string | null = null;
let tokenExpiresAt = 0;
let tokenInflight: Promise<string | null> | null = null;

const TOKEN_TTL_MS = 4 * 60 * 1000;

async function fetchAccessToken(): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  if (tokenInflight) {
    return tokenInflight;
  }

  tokenInflight = fetch("/api/auth/token", { credentials: "include" })
    .then(async (response) => {
      if (!response.ok) {
        cachedToken = null;
        tokenExpiresAt = 0;
        return null;
      }

      const body = (await response.json()) as {
        success: boolean;
        accessToken?: string;
      };

      if (!body.success || !body.accessToken) {
        return null;
      }

      cachedToken = body.accessToken;
      tokenExpiresAt = Date.now() + TOKEN_TTL_MS;
      return cachedToken;
    })
    .finally(() => {
      tokenInflight = null;
    });

  return tokenInflight;
}

export function clearDirectApiToken() {
  cachedToken = null;
  tokenExpiresAt = 0;
}

export async function directApi<TData, TMeta = undefined>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<TData, TMeta>> {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const token = await fetchAccessToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}${path}`, {
    ...options,
    headers,
    credentials: "omit",
  });

  const payload = (await response.json().catch(() => ({}))) as ApiResponse<
    TData,
    TMeta
  >;

  if (response.status === 401) {
    clearDirectApiToken();
  }

  if (!response.ok) {
    throw new Error(
      payload?.message || `Request failed with status ${response.status}`,
    );
  }

  return payload;
}
