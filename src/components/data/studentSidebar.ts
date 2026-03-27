import { fetchMyClassroomsAction } from "@/actions/classroomActions/_fetchMyClassroomsAction";
import { SidebarData, NavItem } from "@/types/sidebar";

export const getStudentSidebarData = async (): Promise<SidebarData> => {
  // 1. Fetch real data from your API via the Server Action
  const result = await fetchMyClassroomsAction();

  // 2. Map the API "memberships" to Sidebar "items"
  // Based on your Postman: label = classroom.name, href = classroom.id
  const dynamicClassroomItems: NavItem[] = (result.data || []).map((membership: any) => ({
    label: membership.classroom.name,
    icon: "BookOpen",
    href: `/dashboard/classroom/${membership.classroom.id}`,
    // Optional: Add a badge if they are a CR
    badge: membership.memberRole === "CR" ? "CR" : undefined
  }));

  // 3. Return the full SidebarData structure
  return {
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
          { label: "Classroom", icon: "BarChart3", href: "/dashboard/classroom" },
        ],
      },
      {
        title: "list of classrooms",
        // INJECT DYNAMIC DATA HERE
        items: dynamicClassroomItems.length > 0
          ? dynamicClassroomItems
          : ([{ label: "No classes joined", icon: "BookOpen", href: "/dashboard/classroom" }] as NavItem[]),
      },
      {
        title: "Community",
        items: [
          { label: "Messages", icon: "MessageSquare", href: "/dashboard/messages", badge: 2 },
        ],
      },
    ],
  };
};