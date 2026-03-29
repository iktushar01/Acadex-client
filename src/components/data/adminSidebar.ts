import { SidebarData } from "@/types/sidebar";

export const adminSidebar: SidebarData = {
  logo: {
    src: "/logo.png",
    alt: "Acadex logo",
    title: "Acadex",
    description: "Admin Panel",
  },
  navGroups: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard",      icon: "LayoutDashboard", href: "/admin/dashboard" },
        { label: "Classrooms Management",      icon: "BarChart3",       href: "/admin/classrooms-management" },
        { label: "Admin Management",  icon: "Bell",            href: "/admin/admin-management"},
      ],
    },
    // {
    //   title: "Management",
    //   items: [
    //     { label: "Users",               icon: "Users",       href: "/dashboard/admin/users" },
    //     { label: "Roles & Permissions", icon: "ShieldCheck", href: "/dashboard/admin/roles" },
    //   ],
    // },
    {
      title: "System",
      items: [
        { label: "Settings", icon: "Settings", href: "/admin/dashboard/settings" },
      ],
    },
  ],
};
