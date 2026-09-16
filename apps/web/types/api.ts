/** 统一 API 响应格式（见 TECH_SPEC 4.4） */

export interface ApiSuccess<T> {
  data: T
  meta?: Record<string, unknown>
}

export interface ApiErrorBody {
  code: string
  message: string
  details?: unknown
}

export interface ApiFailure {
  error: ApiErrorBody
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export function apiSuccess<T>(data: T, meta?: Record<string, unknown>): ApiSuccess<T> {
  return meta ? { data, meta } : { data }
}

export function apiFailure(code: string, message: string, details?: unknown): ApiFailure {
  return { error: details === undefined ? { code, message } : { code, message, details } }
}

export function isApiFailure<T>(res: ApiResponse<T>): res is ApiFailure {
  return 'error' in res
}
