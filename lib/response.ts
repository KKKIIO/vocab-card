import { ZodError } from "zod";

export interface SuccessResponse {
  data: any;
}
export interface ApiError {
  message: string;
}
export interface ErrorResponse {
  error: ApiError;
}
export type Response = SuccessResponse | ErrorResponse;

export function DefaultResponse(): Response {
  return { data: null };
}

export function GetApiError(response: Response): ApiError | null {
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
