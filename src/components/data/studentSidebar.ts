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
    badge: membership.memberRole === "CR" ? "CR" : undefined
  }));

  const classroomChatItems: NavItem[] = (result.data || []).map((membership: any) => ({
    label: `${membership.classroom.name} Chat`,
    icon: "MessageSquare",
    href: `/dashboard/classroom/${membership.classroom.id}/chat`,
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
          { label: "Classroom", icon: "LayoutDashboard", href: "/dashboard/classroom" },
          { label: "Leaderboard", icon: "BarChart3", href: "/dashboard/classroom/leaderboard" },
          { label: "Favorites", icon: "Heart", href: "/dashboard/favorites" },
          { label: "Services", icon: "ClipboardList", href: "/dashboard/services" },
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
        title: "Messages",
        items:
          classroomChatItems.length > 0
            ? classroomChatItems
            : ([
                {
                  label: "Messages",
                  icon: "MessageSquare",
                  href: "/dashboard/classroom/Group-chat",
                },
              ] as NavItem[]),
      },
      {
      title: "System",
      items: [
        { label: "Settings", icon: "Settings", href: "/dashboard/settings" },
      ],
    },
    ],
  };
};
