import { cache } from "react";
import { fetchMyClassroomsAction } from "@/actions/classroomActions/_fetchMyClassroomsAction";

/**
 * Dedupes classroom membership fetches within a single server render pass
 * (sidebar, layouts, parallel server components).
 */
export const getCachedMyClassrooms = cache(async () => {
  return fetchMyClassroomsAction();
});
