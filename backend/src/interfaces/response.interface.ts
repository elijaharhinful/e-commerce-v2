export interface ApiResponse<T> {
    successful: boolean;
    message: string;
    data: T | string;
}