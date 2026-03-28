import { Subject } from "./classroomSubject.types";

export interface ICreateFolderPayload {
  name: string;
  subjectId: string;
  /** Direct Cloudinary URL (already uploaded) */
  coverImage?: string;
}

export interface IUpdateFolderInput {
  name?: string;
  /** Direct Cloudinary URL (already uploaded) */
  coverImage?: string;
}


export interface IFolderResponse {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  subject?: Subject;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    files: number;
  };
}