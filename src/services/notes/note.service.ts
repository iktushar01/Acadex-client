import { httpClient } from "@/lib/axios/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  INote,
  INotesListResponse,
  IGetNotesParams,
} from "@/types/note.types";

// ─── Get Notes ────────────────────────────────────────────────────────────────

/**
 * GET /notes?subjectId=xxx&folderId=yyy&...
 * Returns paginated notes. Visibility (APPROVED only vs all) is enforced
 * server-side based on the caller's classroom role.
 */
export const getNotesService = async (
  params: IGetNotesParams
): Promise<ApiResponse<INotesListResponse>> => {
  // Strip undefined / empty-string values so the URL stays clean
  const query: Record<string, unknown> = {};
  if (params.subjectId) query.subjectId = params.subjectId;
  if (params.folderId) query.folderId = params.folderId;
  if (params.searchTerm) query.searchTerm = params.searchTerm;
  if (params.status) query.status = params.status;
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;

  return httpClient.get<INotesListResponse>("/notes", { params: query });
};

/**
 * GET /notes/:id
 * Returns a single note for the detail page.
 */
export const getNoteByIdService = async (
  noteId: string
): Promise<ApiResponse<INote>> => {
  return httpClient.get<INote>(`/notes/${noteId}`);
};

// ─── Create Note ──────────────────────────────────────────────────────────────

/**
 * POST /notes  (multipart/form-data)
 * Files are passed via a FormData object that already contains the text fields.
 * Do not set Content-Type manually — axios must add the multipart boundary.
 */
export const createNoteService = async (
  formData: FormData
): Promise<ApiResponse<INote>> => {
  return httpClient.post<INote>("/notes", formData, {
    timeout: 120_000, // uploads can be slow
  });
};

// ─── Approve ──────────────────────────────────────────────────────────────────

/**
 * PATCH /notes/:id/approve
 * CR only — backend enforces the role check.
 */
export const approveNoteService = async (
  noteId: string
): Promise<ApiResponse<INote>> => {
  return httpClient.patch<INote>(`/notes/${noteId}/approve`, {});
};

// ─── Reject ───────────────────────────────────────────────────────────────────

/**
 * PATCH /notes/:id/reject
 * CR only — backend enforces the role check.
 */
export const rejectNoteService = async (
  noteId: string
): Promise<ApiResponse<INote>> => {
  return httpClient.patch<INote>(`/notes/${noteId}/reject`, {});
};

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * DELETE /notes/:id
 * Uploader OR CR — backend enforces the permission check.
 * Cascades to NoteFiles and Cloudinary on the server side.
 */
export const deleteNoteService = async (
  noteId: string
): Promise<ApiResponse<{ id: string; title: string; deletedFilesCount: number }>> => {
  return httpClient.delete(`/notes/${noteId}`);
};
