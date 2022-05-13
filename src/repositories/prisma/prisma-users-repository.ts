

import { prisma } from '../../prisma';
import { UserCreateData, UsersRepository } from '../users.repository';

export class PrismaUsersRepository implements UsersRepository {
  async create ({ type, comment, screenshot }: UserCreateData) {
    await prisma.users.create({
      data: {
      
      }
    })
  }
}