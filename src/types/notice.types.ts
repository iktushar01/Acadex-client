export interface Notice {
  id: string;
  content: string;
  isActive: boolean;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}
