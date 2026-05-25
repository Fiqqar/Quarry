import { AppError } from "./app-error";

type ErrorContext = {
  code?: string | number;
  error: unknown;
  set: {
    status?: number | string;
  };
};

export function errorHandler({ code, error, set }: ErrorContext) {
  if (error instanceof AppError) {
    set.status = error.statusCode;

    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  if (code === "NOT_FOUND") {
    set.status = 404;

    return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
      },
    };
  }

  if (code === "VALIDATION") {
    set.status = 400;

    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
      },
    };
  }

  set.status = 500;

  return {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    },
  };
}
