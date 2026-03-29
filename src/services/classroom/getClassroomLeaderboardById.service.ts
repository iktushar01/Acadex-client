import { httpClient } from "@/lib/axios/httpClient";
import { ClassroomLeaderboard } from "@/types/classroom.types";

export const getClassroomLeaderboardById = async (classroomId: string) => {
  return await httpClient.get<ClassroomLeaderboard>(`/classrooms/${classroomId}/leaderboard`);
};
