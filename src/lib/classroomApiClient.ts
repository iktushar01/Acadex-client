"use client";

import { directApi } from "@/lib/directApi";
import type { Membership } from "@/types/classroom.types";
import type { Notice } from "@/types/notice.types";

export const fetchMyClassroomsClient = () =>
  directApi<Membership[]>("/classrooms/my-memberships");

export const fetchCurrentNoticeClient = () =>
  directApi<Notice | null>("/notices/current");
