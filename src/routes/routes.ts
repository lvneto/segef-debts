import express from 'express';
import { PrismaUsersRepository } from '../repositories/prisma/prisma-users-repository';
import { SubmitUserUseCase } from '../use-cases/submit-users-use-case';

export const routes = express.Router();

routes.post('/users', async (req, res) => {
  const { type, comment, screenshot} = req.body;

  const prismaUsersRepository = new PrismaUsersRepository();

  const submitUserUseCase = new SubmitUserUseCase(
    prismaUsersRepository,
  )  

  await submitUserUseCase.execute({
    type,
    comment,
    screenshot
  })


  return res.status(201).send();
})