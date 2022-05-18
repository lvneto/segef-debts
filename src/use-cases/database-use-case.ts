import { DatabaseRepository } from "../repositories/database.repository";

export class DatabaseUseCase {
  constructor(
    private databaseRepository: DatabaseRepository,
  ) {}

  async execute(): Promise<any> {   
    return await this.databaseRepository.checkDatabaseAndUpdate()    
  }
}