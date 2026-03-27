"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { CreateSubjectInput, Subject, UpdateSubjectInput } from "@/types/classroomSubject.types";
import { ApiResponse } from "@/types/api.types";

/**
 * Communicates with POST /subjects
 */
export const createSubject = async (
    data: CreateSubjectInput
): Promise<ApiResponse<Subject>> => {
    return await httpClient.post<Subject>("/subjects", data);
};

export const updateSubject = async (
    id: string,
    data: UpdateSubjectInput
): Promise<ApiResponse<Subject>> => {
    return await httpClient.patch<Subject>(`/subjects/${id}`, data);
};

export const deleteSubject = async (id: string): Promise<ApiResponse<any>> => {
    return await httpClient.delete(`/subjects/${id}`);
};

// Also add a getter for a single subject for the Edit Page
export const getSubjectById = async (id: string): Promise<ApiResponse<Subject>> => {
    return await httpClient.get<Subject>(`/subjects/${id}`);
};