// Logs Service Types

// List Logs
export interface ListLogsRequest {
  page?: number;
  limit?: number;
  role?: string;
  email?: string;
  name?: string;
  route?: string;
  dateStart?: string;
  dateEnd?: string;
  dateExact?: string;
}

export interface LogPayload {
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export interface LogListItem {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userRole: string | null;
  route: string;
  method: string;
  statusCode: number;
  success: boolean;
  payload: LogPayload;
  createdAt: string;
}

export interface ListLogsResponse {
  items: LogListItem[];
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
