import { UsersRepository } from "../repositories/users.repository";

export class FindUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute(skip: number, take: number, document: string): Promise<any> {   
    return await this.usersRepository.findUser(skip, take, document)    
  }
}