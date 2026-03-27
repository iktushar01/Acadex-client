/* eslint-disable @typescript-eslint/no-explicit-any */
import { getNewTokensWithRefreshToken } from '@/services/auth/auth.services';
import { ApiResponse } from '@/types/api.types';
import axios, { AxiosRequestConfig } from 'axios';
import { cookies, headers } from 'next/headers';
import { isTokenExpiringSoon } from '../tokenUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in environment variables');
}

async function tryRefreshToken(
    accessToken: string,
    refreshToken: string
): Promise<void> {
    if (!(await isTokenExpiringSoon(accessToken))) {
        return;
    }

    const requestHeader = await headers();

    if (requestHeader.get("x-token-refreshed") === "1") {
        return;
    }

    try {
        await getNewTokensWithRefreshToken(refreshToken);
    } catch (error: any) {
        console.error("Error refreshing token in http client:", error);
    }
}

/**
 * Creates an Axios instance with dynamic server-side cookies and configurable options.
 */
const axiosInstance = async (customConfig?: AxiosRequestConfig) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken && refreshToken) {
        await tryRefreshToken(accessToken, refreshToken);
    }

    const cookieHeader = cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

    return axios.create({
        baseURL: API_BASE_URL,
        // Default to 60s to prevent 'ECONNABORTED' during image/email processing
        timeout: customConfig?.timeout || 60000,
        headers: {
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            ...customConfig?.headers
        }
    });
}

export interface ApiRequestOptions extends AxiosRequestConfig {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
}

// --- HTTP METHOD HELPERS ---

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance(options);
        const response = await instance.get<ApiResponse<TData>>(endpoint, options);
        return response.data;
    } catch (error: any) {
        console.error(`GET request to ${endpoint} failed:`, error.message);
        throw error;
    }
}

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance(options);
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, options);
        return response.data;
    } catch (error: any) {
        console.error(`POST request to ${endpoint} failed:`, error.message);
        throw error;
    }
}

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance(options);
        const response = await instance.put<ApiResponse<TData>>(endpoint, data, options);
        return response.data;
    } catch (error: any) {
        console.error(`PUT request to ${endpoint} failed:`, error.message);
        throw error;
    }
}

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance(options);
        const response = await instance.patch<ApiResponse<TData>>(endpoint, data, options);
        return response.data;
    } catch (error: any) {
        console.error(`PATCH request to ${endpoint} failed:`, error.message);
        throw error;
    }
}

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance(options);
        const response = await instance.delete<ApiResponse<TData>>(endpoint, options);
        return response.data;
    } catch (error: any) {
        console.error(`DELETE request to ${endpoint} failed:`, error.message);
        throw error;
    }
}

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
};