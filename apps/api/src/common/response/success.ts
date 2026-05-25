type SuccessResponse<TData, TMeta = undefined> = TMeta extends undefined
  ? {
      success: true;
      data: TData;
    }
  : {
      success: true;
      data: TData;
      meta: TMeta;
    };

export function success<TData>(data: TData): SuccessResponse<TData>;
export function success<TData, TMeta>(data: TData, meta: TMeta): SuccessResponse<TData, TMeta>;
export function success<TData, TMeta>(data: TData, meta?: TMeta) {
  if (meta === undefined) {
    return {
      success: true,
      data,
    };
  }

  return {
    success: true,
    data,
    meta,
  };
}

