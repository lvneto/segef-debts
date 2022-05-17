export interface UserCreateData {
  users: string;
}

export interface UsersRepository {
  findUsers: (skip:number, take: number) => Promise<any>;
} 