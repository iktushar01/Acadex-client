import { useState, useEffect, useCallback } from "react";
import { getClientMemberships } from "@/lib/membershipClientCache";

/**
 * Determines CR role for a classroom using a cached direct API fetch.
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
      const data = await getClientMemberships();

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
