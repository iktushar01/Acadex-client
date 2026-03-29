import { httpClient } from "@/lib/axios/httpClient";
import { ClassroomLeaderboard } from "@/types/classroom.types";

export const getClassroomLeaderboard = async () => {
  return await httpClient.get<ClassroomLeaderboard[]>("/classrooms/leaderboard");
};
