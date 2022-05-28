import { prisma } from '../../prisma';
import { UsersRepository } from '../users.repository';

export class PrismaUsersRepository implements UsersRepository {

  async findUser (skip: number, take: number, cnpj: string, cpf: string): Promise<any> {
    return await prisma.users.findMany({
      where: {       
        OR:  [{ cnpj }, { cpf }]           
      },    
      skip: skip || 0,
      take: take || 100  
    })
  }

}