import { UsersRepository } from "../repositories/users.repository";

interface SubmitUserUseCaseRequest {
 //data
}

export class SubmitUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) {}

  async execute(request: SubmitUserUseCaseRequest) {
    const {//data} = request;  
    
    await this.usersRepository.create({
      //data
    })   
  }
}