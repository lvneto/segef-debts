import express, { Response } from 'express';
import { PrismaUsersRepository } from '../repositories/prisma/prisma-users-repository';
import { FindUserUseCase } from '../use-cases/find-users-use-case';

export const routes = express.Router();

routes.get('/users', async (request: any , response: Response): Promise<Response> => {
  const skip = parseFloat(request.query.skip)
  const take = parseFloat(request.query.take)

  const prismaUsersRepository = new PrismaUsersRepository();

  const findUserUseCase = new FindUserUseCase(
    prismaUsersRepository,
  )  

   const result = await findUserUseCase.execute(skip, take)

   return response.json(result)
   
})