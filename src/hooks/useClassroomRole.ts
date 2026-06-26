import { useState, useEffect, useCallback } from "react";
import { fetchMyClassroomsAction } from "@/actions/classroomActions/_fetchMyClassroomsAction";
import { getClientMemberships } from "@/lib/membershipClientCache";

/**
 * Custom hook to determine if the current user is a CR for a specific classroom.
 * Reuses a short-lived in-memory cache to avoid refetching all classrooms per component.
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
      const data = await getClientMemberships(fetchMyClassroomsAction);

      if (data) {
        const membership = data.find(
          (item) => item.classroom.id === classroomId,
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
    void checkRole();
  }, [checkRole]);

  return { isCR, roleLoading, userRole, refreshRole: checkRole };
};
