export interface Classroom {
  id: string;
  name: string;
  institutionName: string;
  level: string;
  className?: string;
  department?: string;
  groupName?: string;
  description?: string;
  joinCode: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  createdAt: string;
  creator?: { id: string; name: string; email: string; image?: string };
}

export interface Membership {
  id: string;
  memberRole: "STUDENT" | "CR"
  classroom: Classroom;
}