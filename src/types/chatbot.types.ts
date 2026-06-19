export type ChatbotMode = "qa" | "summarize" | "quiz";

export interface ChatSource {
  noteId: string;
  noteTitle: string;
  snippet: string;
  similarity: number;
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[] | null;
  createdAt: string;
}

export interface AskChatbotPayload {
  classroomId: string;
  message: string;
  subjectId?: string;
  noteId?: string;
  mode?: ChatbotMode;
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
  notesIndexed: number;
  chunksIndexed: number;
}
