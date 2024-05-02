import { ZodError } from "zod";

export interface SuccessResponse<T> {
  data: T;
}
export interface ApiError {
  message: string;
}
export interface ErrorResponse {
  error: ApiError;
}
export type Response<T = undefined> = SuccessResponse<T> | ErrorResponse;

export function MutResponse(): Response {
  return { data: undefined };
}

export function GetApiError<T>(response: {} | { error: ApiError }): ApiError | undefined {
  if ("error" in response) {
    return response.error;
  }
  return undefined;
}

export function MakeValidateError<T>(e: ZodError<T>): ApiError {
  return {
    message: JSON.stringify(e.flatten().fieldErrors),
  };
}
