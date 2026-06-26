"use client";

import { directApi } from "@/lib/directApi";
import type { UserProfile } from "@/actions/_getCurrentUserAction";

export const fetchCurrentUserClient = () =>
  directApi<UserProfile>("/auth/me");
