import { Subject } from "./classroomSubject.types";

export interface ICreateFolderPayload {
  name: string;
  subjectId: string;
  /** Direct Cloudinary URL (already uploaded) */
  coverImage?: string;
}

export interface IUpdateFolderPayload {
  folderId: string;
  name?: string;
  /** URL to set; `null` removes the cover (matches server PATCH body) */
  coverImage?: string | null;
  coverImageBase64?: string;
}

export interface IDeleteFolderPayload {
  folderId: string;
}


export interface IFolderResponse {
  id: string;
  name: string;
  subjectId: string;
  description?: string;
  subject?: Subject;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    files: number;
  };
}