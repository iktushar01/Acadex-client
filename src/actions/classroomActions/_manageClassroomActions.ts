"use server";

import {
  getClassroomMembersService,
  updateClassroomMemberRoleService,
} from "@/services/classroom/manageClassroom.service";

export const getClassroomMembersAction = async (classroomId: string) => {
  try {
    const response = await getClassroomMembersService(classroomId);
    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error: unknown) {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      data: null,
      error:
        maybeAxiosError.response?.data?.message ||
        maybeAxiosError.message ||
        "Failed to load classroom members",
    };
  }
};

export const updateClassroomMemberRoleAction = async (
  classroomId: string,
  targetUserId: string,
  role: "STUDENT" | "CR",
) => {
  try {
    const response = await updateClassroomMemberRoleService(classroomId, targetUserId, role);
    return {
      success: true,
      data: response.data,
      message: response.message || "Member role updated successfully",
    };
  } catch (error: unknown) {
    const maybeAxiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      data: null,
      message:
        maybeAxiosError.response?.data?.message ||
        maybeAxiosError.message ||
        "Failed to update member role",
    };
  }
};
