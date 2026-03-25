import { SidebarData } from "@/types/sidebar";

export const studentSidebar: SidebarData = {
  logo: {
    src: "/logo.png",
    alt: "Acadex logo",
    title: "Acadex",
    description: "Student Panel",
  },
  navGroups: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" },
        { label: "Progress",  icon: "BarChart3",       href: "/dashboard/progress" },
      ],
    },
    {
      title: "Learning",
      items: [
        { label: "Tasks",    icon: "ClipboardList", href: "/dashboard/tasks",    badge: 5 },
        { label: "Courses",  icon: "BookOpen",      href: "/dashboard/courses" },
        { label: "Schedule", icon: "CalendarDays",  href: "/dashboard/schedule" },
      ],
    },
    {
      title: "Community",
      items: [
        { label: "Messages", icon: "MessageSquare", href: "/dashboard/messages", badge: 2 },
      ],
    },
  ],
};