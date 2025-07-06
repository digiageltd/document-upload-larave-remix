const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!API_BASE_URL) throw new Error("VITE_API_BASE_URL is not set!");

/**
 * Backend API endpoints for the application.
 */
export const endpoints = {
    media: () => `${API_BASE_URL}/api/v1/media`,
};

/**
 * Represents a media file uploaded to the system.
 */
export interface MediaFile {
    id: number;
    original_name: string;
    file_name: string;
    url: string;
    type: string;
    category: string;
    created_at: string;
    updated_at: string;
}

export interface GroupedMedia {
    [category: string]: MediaFile[];
}

export interface MediaListResponse {
    data: GroupedMedia;
}

/**
 * Thrown for network and API-level errors.
 */
export class ApiError<T = unknown> extends Error {
    status: number;
    data?: T;

    constructor(message: string, status: number, data?: T) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

/**
 * Type guard for API error responses with a message.
 */
function isApiErrorPayload(obj: unknown): obj is { message: string } {
    return (
        obj !== null &&
        typeof obj === "object" &&
        "message" in obj &&
        typeof (obj as { message?: unknown }).message === "string"
    );
}

/**
 * Generic API request function with error handling.
 */
export async function apiRequest<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    let response: Response;
    try {
        response = await fetch(input, init);
    } catch {
        throw new ApiError("Network error. Backend may be offline or misconfigured.", 0);
    }

    if (!response.ok) {
        let errorData: unknown;
        try {
            errorData = await response.json();
        } catch {
            errorData = undefined;
        }

        throw new ApiError(
            isApiErrorPayload(errorData)
                ? errorData.message
                : `API error (status ${response.status})`,
            response.status,
            errorData
        );
    }
    return await response.json() as Promise<T>;
}

/**
 * Fetch grouped media files from backend.
 */
export async function fetchMedia() {
    const res = await apiRequest<MediaListResponse>(endpoints.media());
    return res.data;
}

/**
 * Delete a media file by ID.
 */
export async function deleteMedia(id: number) {
    const res = await fetch(`${endpoints.media()}/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) {
        let errorMsg = "Delete failed";
        try {
            const errorJson = await res.json();
            errorMsg = errorJson.message || errorMsg;
        } catch {}
        throw new ApiError(errorMsg, res.status);
    }
    return true;
}


export interface MediaCategory {
    key: string;
    label: string;
    description: string;
    max_files: number;
}

export interface MediaCategoryListResponse {
    data: MediaCategory[];
}

export async function fetchCategories() {
    const res = await apiRequest<MediaCategoryListResponse>(`${endpoints.media()}/categories`);
    return res.data;
}