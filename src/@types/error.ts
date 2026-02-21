export type ApiErrorDetail = {
  field?: string;
  message: string;
  code?: string;
};

export type ApiErrorResponse = {
  statusCode: number;
  timestamp: string;
  message: string;
  error: string;
  path: string;
  method: string;
  errors?: ApiErrorDetail[];
};
