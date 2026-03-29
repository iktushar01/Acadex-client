import { httpClient } from "@/lib/axios/httpClient";

export const leaveClassroomService = async (classroomId: string) => {
  return await httpClient.delete<{ classroomId: string; classroomName: string }>(
    `/classrooms/${classroomId}/leave`
  );
};
