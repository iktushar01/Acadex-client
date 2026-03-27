import { useState, useEffect, useCallback } from "react";
import { fetchMyClassroomsAction } from "@/actions/classroomActions/_fetchMyClassroomsAction";

/**
 * Custom hook to determine if the current user is a CR for a specific classroom.
 * @param classroomId The ID of the classroom to check against.
 */
export const useClassroomRole = (classroomId?: string) => {
  const [isCR, setIsCR] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const checkRole = useCallback(async () => {
    if (!classroomId) {
      setRoleLoading(false);
      return;
    }

    try {
      setRoleLoading(true);
      const result = await fetchMyClassroomsAction();

      if (result.success && result.data) {
        // Find the specific classroom membership from the API data
        const membership = result.data.find(
          (m: any) => m.classroom.id === classroomId
        );

        const role = membership?.memberRole || null;
        setUserRole(role);
        setIsCR(role === "CR");
      }
    } catch (error) {
      console.error("Error checking classroom role:", error);
      setIsCR(false);
    } finally {
      setRoleLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    checkRole();
  }, [checkRole]);

  return { isCR, roleLoading, userRole, refreshRole: checkRole };
};