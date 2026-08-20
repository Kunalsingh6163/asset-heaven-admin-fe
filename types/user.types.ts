export interface User {
  _id: string;
  name: string;
  email: string;
  authMethods: string[];
  lastLoginMethod: string;
  isEmailVerified: boolean;
  admin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}
