import { ZodError } from "zod";

export interface SuccessResponse<T = any> {
  data: T;
}
export interface ApiError {
  message: string;
}
export interface ErrorResponse {
  error: ApiError;
}
export type Response<T = any> = SuccessResponse<T> | ErrorResponse;

export function DefaultResponse(): Response {
  return { data: null };
}

export function GetApiError<T>(response: Response<T>): ApiError | null {
  if ("error" in response) {
    return response.error;
  }
  return null;
}

export function MakeValidateError<T>(e: ZodError<T>): ApiError {
  return {
    message: JSON.stringify(e.flatten().fieldErrors),
  };
}
