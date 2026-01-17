export interface ZodApiError {
    code: string;
    message: string;
    path: string[];
}

export interface ApiErrorResponse {
    error: string;
    errors?: ZodApiError[];
}