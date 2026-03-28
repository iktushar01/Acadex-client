import { useState, useEffect, useCallback } from "react";
import { INote, INotesMeta, NoteStatus } from "@/types/note.types";
import {
  fetchNotesAction,
  approveNoteAction,
  rejectNoteAction,
  deleteNoteAction,
} from "@/actions/notesAction/_notesActions";

// ─── State shape ──────────────────────────────────────────────────────────────

interface UseNotesState {
  notes: INote[];
  meta: INotesMeta | null;
  loading: boolean;
  actionLoading: string | null; // noteId currently being actioned
  error: string | null;
}

interface UseNotesFilters {
  searchTerm: string;
  status: NoteStatus | "";
  page: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages fetching, filtering, and CR actions (approve / reject / delete)
 * for the notes list belonging to a subject + optional folder.
 *
 * @param subjectId  Required — the subject whose notes to load.
 * @param folderId   Optional — scopes notes to a specific folder.
 */
export const useNotes = (subjectId: string, folderId?: string) => {
  const [state, setState] = useState<UseNotesState>({
    notes: [],
    meta: null,
    loading: true,
    actionLoading: null,
    error: null,
  });

  const [filters, setFilters] = useState<UseNotesFilters>({
    searchTerm: "",
    status: "",
    page: 1,
  });

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchNotes = useCallback(async () => {
    if (!subjectId) {
      setState((prev) => ({
        ...prev,
        loading: false,
        notes: [],
        meta: null,
        error: null,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const result = await fetchNotesAction({
      subjectId,
      folderId,
      searchTerm: filters.searchTerm || undefined,
      status: filters.status || undefined,
      page: filters.page,
    });

    if (result.success && result.data) {
      const raw = result.data as any;
      // Handle both { data: Note[], meta: ... } and plain Note[]
      const notes: INote[] = Array.isArray(raw) ? raw : (raw.data ?? []);
      const meta: INotesMeta | null = Array.isArray(raw) ? null : (raw.meta ?? null);

      setState((prev) => ({
        ...prev,
        notes,
        meta,
        loading: false,
        error: null,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: result.error || "Failed to load notes",
      }));
    }
  }, [subjectId, folderId, filters]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ── Filters ────────────────────────────────────────────────────────────────

  const setSearchTerm = (searchTerm: string) =>
    setFilters((prev) => ({ ...prev, searchTerm, page: 1 }));

  const setStatus = (status: NoteStatus | "") =>
    setFilters((prev) => ({ ...prev, status, page: 1 }));

  const setPage = (page: number) =>
    setFilters((prev) => ({ ...prev, page }));

  const clearFilters = () =>
    setFilters({ searchTerm: "", status: "", page: 1 });

  // ── Approve ────────────────────────────────────────────────────────────────

  const approveNote = useCallback(
    async (noteId: string) => {
      setState((prev) => ({ ...prev, actionLoading: noteId }));
      const result = await approveNoteAction(noteId, subjectId, folderId);
      setState((prev) => ({ ...prev, actionLoading: null }));

      if (result.success) {
        // Optimistically update status in local state
        setState((prev) => ({
          ...prev,
          notes: prev.notes.map((n) =>
            n.id === noteId ? { ...n, status: "APPROVED" as NoteStatus } : n
          ),
        }));
      }
      return result;
    },
    [subjectId, folderId]
  );

  // ── Reject ─────────────────────────────────────────────────────────────────

  const rejectNote = useCallback(
    async (noteId: string) => {
      setState((prev) => ({ ...prev, actionLoading: noteId }));
      const result = await rejectNoteAction(noteId, subjectId, folderId);
      setState((prev) => ({ ...prev, actionLoading: null }));

      if (result.success) {
        setState((prev) => ({
          ...prev,
          notes: prev.notes.map((n) =>
            n.id === noteId ? { ...n, status: "REJECTED" as NoteStatus } : n
          ),
        }));
      }
      return result;
    },
    [subjectId, folderId]
  );

  // ── Delete ─────────────────────────────────────────────────────────────────

  const deleteNote = useCallback(
    async (noteId: string) => {
      setState((prev) => ({ ...prev, actionLoading: noteId }));
      const result = await deleteNoteAction(noteId, subjectId, folderId);
      setState((prev) => ({ ...prev, actionLoading: null }));

      if (result.success) {
        setState((prev) => ({
          ...prev,
          notes: prev.notes.filter((n) => n.id !== noteId),
          meta: prev.meta
            ? { ...prev.meta, total: prev.meta.total - 1 }
            : null,
        }));
      }
      return result;
    },
    [subjectId, folderId]
  );

  // ── Derived stats ──────────────────────────────────────────────────────────

  const stats = {
    approved: state.notes.filter((n) => n.status === "APPROVED").length,
    pending: state.notes.filter((n) => n.status === "PENDING").length,
    rejected: state.notes.filter((n) => n.status === "REJECTED").length,
    totalFiles: state.notes.reduce((sum, n) => sum + n.files.length, 0),
  };

  return {
    // State
    notes: state.notes,
    meta: state.meta,
    loading: state.loading,
    actionLoading: state.actionLoading,
    error: state.error,
    // Filters
    filters,
    setSearchTerm,
    setStatus,
    setPage,
    clearFilters,
    // Actions
    fetchNotes,
    approveNote,
    rejectNote,
    deleteNote,
    // Derived
    stats,
  };
};