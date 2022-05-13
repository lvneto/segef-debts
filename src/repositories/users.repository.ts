export interface UserCreateData {
  type: string;
  comment: string;
  screenshot?: string;
}

export interface UsersRepository {
  create: (data: UserCreateData) => Promise<void>;
}