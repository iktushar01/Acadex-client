export interface Classroom {
  id: string;
  name: string;
  institutionName: string;
  level: string;
  className?: string | null;
  department?: string | null;
  groupName?: string | null;
  description?: string | null;
  joinCode: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  createdAt: string;
  creator: { id: string; name: string; email: string; image?: string | null };
  _count?: { memberships: number };
}

export interface Membership {
  memberRole: "STUDENT" | "CR";
  joinedAt?: string;
  classroom: Classroom;
}

export interface ClassroomLeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  memberRole: "STUDENT" | "CR";
  score: number;
  notesUploaded: number;
  approvedNotes: number;
  commentsCount: number;
  favoritesReceived: number;
}

export interface ClassroomLeaderboard {
  classroom: Pick<Classroom, "id" | "name" | "institutionName" | "status">;
  myMembershipRole: "STUDENT" | "CR";
  topMembers: ClassroomLeaderboardEntry[];
  allMembers?: ClassroomLeaderboardEntry[];
  myRank: ClassroomLeaderboardEntry | null;
  totalMembers: number;
}
