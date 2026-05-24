export type ApiSuccess<TData, TMeta = Record<string, never>> = {
  success: true;
  data: TData;
  meta?: TMeta;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<TData, TMeta = Record<string, never>> =
  | ApiSuccess<TData, TMeta>
  | ApiError;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

