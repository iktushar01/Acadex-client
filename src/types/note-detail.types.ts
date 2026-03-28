export interface INoteDetailUser {
  id: string;
  name: string;
  image?: string | null;
  role?: string;
}

export interface INoteComment {
  id: string;
  content: string;
  noteId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  user: INoteDetailUser;
  likeCount: number;
  isLikedByMe: boolean;
  replies: INoteComment[];
}
