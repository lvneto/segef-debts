import { UsersRepository } from "../repositories/users.repository";

export class FindUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async findUser(skip: number, take: number, cnpj: string, cpf: string): Promise<any> {   
    return await this.usersRepository.findUser(skip, take, cnpj, cpf)    
  }
}