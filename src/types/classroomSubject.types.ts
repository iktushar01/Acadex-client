export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  classroomId: string;
  createdAt: string;
}


export interface Folder {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    files: number;
  };
}