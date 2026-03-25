import { adminSidebar } from "@/components/data/adminSidebar";
import { studentSidebar } from "@/components/data/studentSidebar";
import { SidebarData } from "@/types/sidebar";
import { UserRole } from "./authUtils";

export const getSidebarData = (role: UserRole): SidebarData => {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return adminSidebar;
    case "STUDENT":
    default:
      return studentSidebar;
  }
};