import { z } from "zod";

// --- Base Enums ---
export const classroomStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export const institutionLevelEnum = z.enum(["SCHOOL", "COLLEGE", "UNIVERSITY"]);

// --- Validations ---

export const joinClassValidation = z.object({
  joinCode: z
    .string()
    .trim()
    .min(6, "Class code must be at least 6 characters long")
    .max(6, "Class code must be exactly 6 characters long"),
});

export const createClassValidation = z.object({
  name: z.string().min(3, "Class name must be at least 3 characters long"),
  institutionName: z.string().min(3, "Institution name must be at least 3 characters long"),
  level: institutionLevelEnum, // Reusing the enum here
  className: z.string().min(3, "Grade/Class name must be at least 3 characters long"),
  department: z.string().min(3, "Department must be at least 3 characters long"),
  groupName: z.string().min(1, "Group name must be at least 1 characters long"),
  description: z.string().min(3, "Class description must be at least 3 characters long"),
});

// --- Filter Schema ---

export const classroomFilterZodSchema = z.object({
  // Reusing the enums directly makes the code much cleaner
  status: classroomStatusEnum.optional(),
  level: institutionLevelEnum.optional(),

  institutionName: z.string().trim().optional(),
  name: z.string().trim().optional(),
  searchTerm: z.string().trim().optional(),

  page: z.coerce
    .number({ message: "Page must be a number" })
    .int()
    .min(1, "Page must be at least 1")
    .default(1),

  limit: z.coerce
    .number({ message: "Limit must be a number" })
    .int()
    .min(1)
    .max(100, "Limit must be at most 100")
    .default(10),
});

// Optional: Export types for use in your frontend components
export type ClassroomFilterValues = z.infer<typeof classroomFilterZodSchema>;
export type CreateClassroomValues = z.infer<typeof createClassValidation>;





