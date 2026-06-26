export interface ChatMessageSender {
  id: string;
  name: string;
  image: string | null;
}

export interface ChatMessage {
  id: string;
  classroomId: string;
  content: string;
  createdAt: string;
  sender: ChatMessageSender;
}

export interface ChatMessagesMeta {
  hasMore: boolean;
  nextCursor: string | null;
}

export interface SendChatMessagePayload {
  classroomId: string;
  content: string;
}

export interface DeleteChatMessageEvent {
  id: string;
  classroomId: string;
}
