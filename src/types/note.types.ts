// ─── File ─────────────────────────────────────────────────────────────────────

export interface INoteFile {
  id: string;
  url: string;
  type: "pdf" | "image";
  fileName: string;
  fileSize: number;
  createdAt: string;
}

// ─── Uploader / Approver ──────────────────────────────────────────────────────

export interface INoteUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

// ─── Note ─────────────────────────────────────────────────────────────────────

export type NoteStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface INote {
  id: string;
  title: string;
  description?: string;
  status: NoteStatus;
  classroomId: string;
  subjectId: string;
  folderId?: string;
  uploadedBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  uploader: INoteUser;
  approver?: INoteUser;
  files: INoteFile[];
  subject: { id: string; name: string };
  folder?: { id: string; name: string };
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface IGetNotesParams {
  subjectId: string;
  folderId?: string;
  searchTerm?: string;
  status?: NoteStatus | "";
  page?: number;
  limit?: number;
}

export interface ICreateNotePayload {
  title: string;
  description?: string;
  classroomId: string;
  subjectId: string;
  folderId?: string;
  /** FormData is used for multipart — files live in the same FormData object */
}

export interface IApproveNotePayload {
  noteId: string;
}

export interface IRejectNotePayload {
  noteId: string;
}

export interface IDeleteNotePayload {
  noteId: string;
}

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface INotesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface INotesListResponse {
  data: INote[];
  meta: INotesMeta;
}

export interface INotesStats {
  approved: number;
  pending: number;
  rejected: number;
  totalFiles: number;
}