import { httpClient } from "@/lib/axios/httpClient";
import type { ClassroomMembersResponse, ClassroomMember } from "@/types/classroom.types";

export const getClassroomMembersService = async (classroomId: string) => {
  return httpClient.get<ClassroomMembersResponse>(`/classrooms/${classroomId}/members`);
};

export const updateClassroomMemberRoleService = async (
  classroomId: string,
  targetUserId: string,
  role: "STUDENT" | "CR",
) => {
  return httpClient.patch<ClassroomMember>(`/classrooms/${classroomId}/members/${targetUserId}/role`, {
    role,
  });
};
