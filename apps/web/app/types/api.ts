export type ApiSuccess<TData, TMeta = unknown> = {
  success: true;
  data: TData;
  meta?: TMeta;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiEnvelope<TData, TMeta = unknown> = ApiSuccess<TData, TMeta> | ApiFailure;

export type ApiResult<TData, TMeta = unknown> = {
  data: TData;
  meta?: TMeta;
};
