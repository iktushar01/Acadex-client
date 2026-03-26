// ─── Core entity ─────────────────────────────────────────────────────────────

export interface Subject {
  id: string;
  name: string;
  coverImage?: string;
  classroomId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    notes: number;
  };
}

// ─── Service payloads ─────────────────────────────────────────────────────────

export interface CreateSubjectInput {
  name: string;
  classroomId: string;
  /** Direct Cloudinary URL (already uploaded) */
  coverImage?: string;
}

export interface UpdateSubjectInput {
  name?: string;
  /** Direct Cloudinary URL (already uploaded) */
  coverImage?: string;
}

// ─── API response ─────────────────────────────────────────────────────────────

export interface DeleteSubjectResponse {
  id: string;
  name: string;
  deletedNotesCount: number;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  subject?: Subject; // Added relation
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    files: number;
  };
}