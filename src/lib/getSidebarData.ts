import { adminSidebar } from "@/components/data/adminSidebar";
import { getStudentSidebarData } from "@/components/data/studentSidebar";
import { SidebarData } from "@/types/sidebar";
import { UserRole } from "./authUtils";

export const getSidebarData = async (role: UserRole): Promise<SidebarData> => {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return adminSidebar;
    case "STUDENT":
    default:
      return await getStudentSidebarData();
  }
};