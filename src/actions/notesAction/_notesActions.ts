"use server";

import { revalidatePath } from "next/cache";
import {
  getNotesService,
  approveNoteService,
  rejectNoteService,
  deleteNoteService,
  createNoteService,
} from "@/services/notes/note.service";
import { IGetNotesParams } from "@/types/note.types";

const revalidateNotesViews = (subjectId: string, folderId?: string) => {
  if (subjectId) {
    revalidatePath(`/dashboard/classroom/subject/${subjectId}/notes`);
  }
  if (folderId) {
    revalidatePath(`/dashboard/classroom/folder/${folderId}`);
  }
};

// ─── Fetch Notes ──────────────────────────────────────────────────────────────

/**
 * Fetches notes for a subject / folder.
 * Passes all query params straight to the service; visibility is enforced
 * server-side based on the caller's classroom membership role.
 */
export const fetchNotesAction = async (params: IGetNotesParams) => {
  try {
    if (!params.subjectId) {
      return { success: false, error: "subjectId is required" };
    }

    const response = await getNotesService(params);

    if (response.success) {
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: response.message || "Failed to fetch notes",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ─── Create Note ──────────────────────────────────────────────────────────────

/**
 * Uploads a new note with one or more files (multipart/form-data).
 * The caller is responsible for building the FormData object with all text
 * fields (title, description, classroomId, subjectId, folderId?) and the
 * file(s) appended under the key "files".
 */
export const createNoteAction = async (formData: FormData) => {
  try {
    const subjectId = formData.get("subjectId") as string | null;

    if (!formData.get("title") || !subjectId || !formData.get("classroomId")) {
      return {
        success: false,
        error: "title, subjectId, and classroomId are required",
      };
    }

    const files = formData.getAll("files");
    if (!files || files.length === 0) {
      return { success: false, error: "At least one file is required" };
    }

    const response = await createNoteService(formData);

    if (response.success) {
      const folderId = formData.get("folderId") as string | null;
      revalidateNotesViews(subjectId, folderId ?? undefined);

      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: response.message || "Failed to upload note",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ─── Approve Note ─────────────────────────────────────────────────────────────

/**
 * CR approves a PENDING note.
 * Re-validates the notes list so the status badge updates immediately.
 */
export const approveNoteAction = async (
  noteId: string,
  subjectId: string,
  folderId?: string
) => {
  try {
    if (!noteId) return { success: false, error: "noteId is required" };

    const response = await approveNoteService(noteId);

    if (response.success) {
      revalidateNotesViews(subjectId, folderId);
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: response.message || "Failed to approve note",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ─── Reject Note ──────────────────────────────────────────────────────────────

/**
 * CR rejects a PENDING note.
 */
export const rejectNoteAction = async (
  noteId: string,
  subjectId: string,
  folderId?: string
) => {
  try {
    if (!noteId) return { success: false, error: "noteId is required" };

    const response = await rejectNoteService(noteId);

    if (response.success) {
      revalidateNotesViews(subjectId, folderId);
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: response.message || "Failed to reject note",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};

// ─── Delete Note ──────────────────────────────────────────────────────────────

/**
 * Deletes a note (uploader or CR).
 * Cascades to NoteFiles + Cloudinary on the server.
 */
export const deleteNoteAction = async (
  noteId: string,
  subjectId: string,
  folderId?: string
) => {
  try {
    if (!noteId) return { success: false, error: "noteId is required" };

    const response = await deleteNoteService(noteId);

    if (response.success) {
      revalidateNotesViews(subjectId, folderId);
      return { success: true, data: response.data };
    }

    return {
      success: false,
      error: response.message || "Failed to delete note",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "An unexpected error occurred",
    };
  }
};