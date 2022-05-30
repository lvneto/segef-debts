import express, { Request, Response } from 'express';
import { PrismaDatabaseRepository } from '../repositories/prisma/prisma-database-repository';
import { PrismaUsersRepository } from '../repositories/prisma/prisma-users-repository';
import { DatabaseUseCase } from '../use-cases/database-use-case';
import { FindUserUseCase } from '../use-cases/find-users-use-case';

export const routes = express.Router();

routes.get('/users', async (request: any , response: Response): Promise<Response> => {
  const skip = parseFloat(request.query.skip)
  const take = parseFloat(request.query.take)
  const cnpj = request.query.cnpj || null
  const cpf = request.query.cpf || null

  const prismaUsersRepository = new PrismaUsersRepository();

  const findUserUseCase = new FindUserUseCase(
    prismaUsersRepository,
  )  

   const result = await findUserUseCase.execute(skip, take, cnpj, cpf)

   return response.json(result)
   
})

routes.get('/database', async (request: Request , response: Response): Promise<Response> => {

  const prismaUsersRepository = new PrismaDatabaseRepository();

  const databaseUseCase = new DatabaseUseCase(
    prismaUsersRepository,
  )  

   const result = await databaseUseCase.execute()

   return response.json(result)
   
})

