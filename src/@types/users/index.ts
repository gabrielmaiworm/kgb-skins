// Users Service Types

// Create Public User
export interface CreatePublicUserRequest {
  name: string;
  email: string;
  phone: string;
  referrerInviteCode?: string;
}

export interface CreatePublicUserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  role: string;
  inviteCode?: string;
  referredByInviteCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  invitedCount?: number;
}

// Create User
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  document: string;
  isActive: boolean;
}

export interface CreateUserResponse {}

// Create Admin
export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  document: string;
  role: string;
  isActive: boolean;
}

export interface CreateAdminResponse {}

// List Users
export interface ListUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: "asc" | "desc";
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  invitedCount?: number;
  inviteCode?: string;
}

export interface ListUsersResponse {
  items: UserListItem[];
  totalPages: number;
  page: number;
  totalItems: number;
  itemsPerPage: number;
}

// Find User By ID
export interface FindUserByIdResponse extends UserListItem {}

// Update User
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UpdateUserResponse {}

// Delete User
export interface DeleteUserResponse {}

// Activate/Inactive User
export interface ActivateInactiveUserRequest {
  isActive: boolean;
}

export interface ActivateInactiveUserResponse {}

// Update Referrer (indicar quem convidou)
export interface UpdateReferrerRequest {
  inviteCode: string;
}

export interface UpdateReferrerResponse {}

// Invited Users (usuários convidados pelo indicador)
export interface InvitedUserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  role: string;
  inviteCode?: string;
  referredByInviteCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListInvitedUsersResponse {
  items: InvitedUserItem[];
  totalPages: number;
  page: number;
  totalItems: number;
  itemsPerPage: number;
}

// Top Inviters (usuários que mais convidaram)
export interface TopInviterItem extends UserListItem {
  invitedCount: number;
}

export interface TopInvitersRequest {
  page?: number;
  limit?: number;
}

export interface TopInvitersResponse {
  items: TopInviterItem[];
  totalPages: number;
  page: number;
  totalItems: number;
  itemsPerPage: number;
}

// Best Buyers (usuários que mais compraram)
export interface BestBuyerItem {
  user: UserListItem;
  totalSpent: number;
}

export interface BestBuyersRequest {
  page?: number;
  limit?: number;
}

export interface BestBuyersResponse {
  items: BestBuyerItem[];
  totalPages: number;
  page: number;
  totalItems: number;
  itemsPerPage: number;
}
