import { httpClient } from "@/lib/axios/httpClient";
import { Membership } from "@/types/classroom.types";

export const getMyClassroomMemberships = async () => {
  return await httpClient.get<Membership[]>("/classrooms/my-memberships");
};