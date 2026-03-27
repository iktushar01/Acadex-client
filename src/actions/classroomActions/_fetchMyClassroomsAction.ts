"use server";

import { getMyClassroomMemberships } from "@/services/classroom/getMyClassroomMemberships.service";

export const fetchMyClassroomsAction = async () => {
  try {
    const response = await getMyClassroomMemberships();

    if (response.success) {
      return { 
        success: true, 
        data: response.data 
      };
    }

    return { 
      success: false, 
      error: response.message || "Failed to fetch classrooms" 
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.response?.data?.message || "An unexpected error occurred" 
    };
  }
};