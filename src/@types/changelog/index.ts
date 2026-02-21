// Changelog Service Types

export type ChangelogType = "SUPPORT" | "FEATURE" | "BUGFIX";

export interface ChangelogItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: ChangelogType;
  createdAt: string;
  updatedAt: string;
}

export interface ListChangelogRequest {
  page?: number;
  limit?: number;
}

export interface ListChangelogResponse {
  items: ChangelogItem[];
  totalPages: number;
  page: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface CreateChangelogRequest {
  date: string;
  title: string;
  description: string;
  type: ChangelogType;
}

export type CreateChangelogResponse = ChangelogItem;
