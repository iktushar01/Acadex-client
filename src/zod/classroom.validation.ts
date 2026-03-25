import z from "zod";

export const joinClassValidation = z.object({
    classCode: z.string().min(6, "Class code must be at least 6 characters long"),
});


export const createClassValidation = z.object({
    name: z.string().min(3, "Class name must be at least 3 characters long"),
    institutionName: z.string().min(3, "Institution name must be at least 3 characters long"),
    level: z.string().min(3, "Level must be at least 3 characters long"),
    className: z.string().min(3, "Class name must be at least 3 characters long"),
    department: z.string().min(3, "Department must be at least 3 characters long"),
    groupName: z.string().min(1, "Group name must be at least 1 characters long"),
    description: z.string().min(3, "Class description must be at least 3 characters long"),
});
