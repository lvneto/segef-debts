import { UsersRepository } from "../repositories/users.repository";

export class FindUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute(skip:number, take: number): Promise<any> {   
    return await this.usersRepository.findUsers(skip, take)    
  }
}