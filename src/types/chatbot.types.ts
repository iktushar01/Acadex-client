export type ChatbotMode = "qa" | "summarize" | "quiz" | "study_plan";

export type ExplanationLevel = "beginner" | "exam" | "advanced";

export interface ChatSource {
  noteId: string;
  noteTitle: string;
  snippet: string;
  similarity: number;
  pageNumber?: number | null;
  sourceIndex: number;
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[] | null;
  mode?: ChatbotMode | null;
  createdAt: string;
}

export interface ChatSessionItem {
  id: string;
  title: string;
  isPinned: boolean;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AskChatbotPayload {
  classroomId: string;
  message: string;
  subjectId?: string;
  noteId?: string;
  folderId?: string;
  sessionId?: string;
  mode?: ChatbotMode;
  level?: ExplanationLevel;
  revealQuizAnswers?: boolean;
}

export interface AskChatbotResponse {
  sessionId: string;
  answer: string;
  sources: ChatSource[];
  mode: ChatbotMode;
}

export interface ChatHistoryResponse {
  sessionId: string | null;
  messages: ChatMessageItem[];
}

export interface ReindexClassroomResponse {
  queued: boolean;
  message: string;
}

export interface IndexJobItem {
  id: string;
  noteId: string;
  classroomId: string;
  status: "pending" | "processing" | "completed" | "failed";
  chunksIndexed: number;
  ocrStatus: string | null;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  noteTitle?: string;
}

export interface ClassroomIndexStats {
  totalNotes: number;
  indexedNotes: number;
  failedNotes: number;
  pendingNotes: number;
  totalChunks: number;
  lastReindexAt: string | null;
  recentJobs: IndexJobItem[];
}

export type StreamEvent =
  | { type: "meta"; sessionId: string; sources: ChatSource[]; mode: ChatbotMode }
  | { type: "token"; content: string }
  | { type: "done" };
