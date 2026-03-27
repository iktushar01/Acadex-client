"use server";

import { ClassroomService } from "@/services/adminClassroomManage/classroomAdmin.service";
import { ClassroomFilterValues } from "@/zod/classroom.validation";

// ─── List ─────────────────────────────────────────────────────────────────────

export async function getAllClassroomsAction(filters: ClassroomFilterValues) {
  try {
    const result = await ClassroomService.getAll(filters);
    
    // Support both { success, data } shape and direct array shape
    const isSuccess = result?.success ?? (Array.isArray(result) || !!result);
    const data = result?.data ?? (Array.isArray(result) ? result : []);
    
    return {
      success: isSuccess,
      data: data,
      meta: result?.meta,
      message: result?.message ?? (isSuccess ? "Data synchronized." : "Grid synchronization failed."),
    };
  } catch (error: any) {
    // Attempt to extract detailed error messages from backend
    const apiError = error.data ?? {};
    const errorSources = apiError.errorSources || apiError.error || [];
    
    const detail = Array.isArray(errorSources) && errorSources.length 
      ? `Validation failed: ${errorSources.map((e: any) => `${e.path || "field"}: ${e.message}`).join(", ")}`
      : error.message || "Network Timeout: Grid Offline.";

    const statusMsg = error.status ? ` (HTTP ${error.status})` : "";

    return {
      success: false,
      message: `${detail}${statusMsg}`,
      data: [],
    };
  }
}

// ─── Approve ──────────────────────────────────────────────────────────────────

export async function approveClassroomAction(classroomId: string) {
  try {
    const result = await ClassroomService.approve(classroomId);
    return {
      success: result.success ?? true,
      data: result.data ?? null,
      message: result.message ?? "Classroom approved.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to approve classroom.",
      data: null,
    };
  }
}

// ─── Reject ───────────────────────────────────────────────────────────────────

export async function rejectClassroomAction(
  classroomId: string,
  rejectionReason: string,
) {
  try {
    const result = await ClassroomService.reject(classroomId, rejectionReason);
    return {
      success: result.success ?? true,
      data: result.data ?? null,
      message: result.message ?? "Classroom rejected.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reject classroom.",
      data: null,
    };
  }
}