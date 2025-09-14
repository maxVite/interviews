import { ApiError } from "@/types";
import { useAppStore } from "@/stores/app";

interface ErrorHandlingConfig {
  showNotifications: boolean;
  logErrors: boolean;
  logLevel: "error" | "warn" | "info";
}

const config: ErrorHandlingConfig = {
  showNotifications: true,
  logErrors: import.meta.env.DEV,
  logLevel: "error",
};

export function handleError(
  error: unknown,
  context?: string,
  options?: Partial<ErrorHandlingConfig>,
): void {
  const finalConfig = { ...config, ...options };
  const appStore = useAppStore();

  if (finalConfig.logErrors) {
    const contextInfo = context ? `[${context}]` : "";
    console[finalConfig.logLevel](`${contextInfo} Error:`, error);
  }

  if (finalConfig.showNotifications) {
    let message = "An unexpected error occurred";

    if (error instanceof ApiError) {
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    appStore.showError(message);
  }
}

export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string,
  options?: Partial<ErrorHandlingConfig>,
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, context, options);
      throw error;
    }
  }) as T;
}

export function useErrorHandler(context?: string) {
  return {
    handleError: (error: unknown, options?: Partial<ErrorHandlingConfig>) =>
      handleError(error, context, options),

    withErrorHandling: <T extends (...args: any[]) => Promise<any>>(
      fn: T,
      options?: Partial<ErrorHandlingConfig>,
    ) => withErrorHandling(fn, context, options),
  };
}

export const ErrorTypes = {
  VALIDATION: "validation",
  NETWORK: "network",
  AUTHENTICATION: "authentication",
  AUTHORIZATION: "authorization",
  NOT_FOUND: "not_found",
  SERVER: "server",
  UNKNOWN: "unknown",
} as const;

export type ErrorType = (typeof ErrorTypes)[keyof typeof ErrorTypes];

export function classifyError(error: unknown): ErrorType {
  if (error instanceof ApiError) {
    if (error.status === 401) return ErrorTypes.AUTHENTICATION;
    if (error.status === 403) return ErrorTypes.AUTHORIZATION;
    if (error.status === 404) return ErrorTypes.NOT_FOUND;
    if (error.status >= 400 && error.status < 500) return ErrorTypes.VALIDATION;
    if (error.status >= 500) return ErrorTypes.SERVER;
    if (error.status === 0) return ErrorTypes.NETWORK;
  }

  return ErrorTypes.UNKNOWN;
}
