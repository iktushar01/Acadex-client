"use server";

import {
  AdminManagementService,
  CreateAdminPayload,
  UpdateAdminPayload,
} from "@/services/adminManagement/adminManagement.service";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export async function getAllAdminsAction() {
  try {
    const result = await AdminManagementService.getAllAdmins();

    return {
      success: result?.success ?? true,
      data: result?.data ?? [],
      message: result?.message ?? "Admins fetched successfully.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: [],
      message: getErrorMessage(error, "Failed to load admins."),
    };
  }
}

export async function createAdminAction(payload: CreateAdminPayload) {
  try {
    const result = await AdminManagementService.createAdmin(payload);

    return {
      success: result?.success ?? true,
      data: result?.data ?? null,
      message: result?.message ?? "Admin created successfully.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Failed to create admin."),
    };
  }
}

export async function updateAdminAction(
  adminId: string,
  payload: UpdateAdminPayload,
) {
  try {
    const result = await AdminManagementService.updateAdmin(adminId, payload);

    return {
      success: result?.success ?? true,
      data: result?.data ?? null,
      message: result?.message ?? "Admin updated successfully.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Failed to update admin."),
    };
  }
}

export async function deleteAdminAction(adminId: string) {
  try {
    const result = await AdminManagementService.deleteAdmin(adminId);

    return {
      success: result?.success ?? true,
      data: result?.data ?? null,
      message: result?.message ?? "Admin deleted successfully.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Failed to delete admin."),
    };
  }
}
