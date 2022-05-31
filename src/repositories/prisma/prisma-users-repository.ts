import { prisma } from '../../prisma';
import { UsersRepository } from '../users.repository';

export class PrismaUsersRepository implements UsersRepository {

  async findUser (skip: number, take: number, cnpj: string, cpf: string): Promise<any> {     
    const users = await prisma.users.findMany({
      where: {       
        OR:  [{ cnpj }, { cpf }]           
      },    
      skip: skip || 0,
      take: take || 100,
      orderBy: {
        started_count_prescription_date: 'desc'
      }  
    })
     
    return await this.sanitizeAndCountTotalDebtUsers(users)
  }

  async sanitizeAndCountTotalDebtUsers(users: any) {
    let data = {
      totalMainDebt: 0,
      users
    }

    for (const user of users) {
      user.cnpj = await this.sanitizeCnpj(user.cnpj)
      user.cpf = await this.sanitizeCpf(user.cpf)
      user.due_date = await this.sanitizeFullyDate(user.due_date)
      user.started_count_prescription_date = await this.sanitizeFullyDate(user.started_count_prescription_date)
      user.users = {}
      data.totalMainDebt += parseFloat(user.main_debt)
    }

    data.users = users
    
    return data
  }

  async sanitizeFullyDate(date: any) {   
    return date.toISOString().substr(0, 10).split('-').reverse().join('/')
  }
  
  async sanitizeCnpj(cnpj: string) {
    const cnpjTwo = cnpj.substring(0, 2)
    const cnpjTreeFirts = cnpj.substring(2, cnpj.length - 9)
    const cnpjTreeSecond = cnpj.substring(5, cnpj.length -6)
    const cnpjTreeThird = cnpj.substring(8, cnpj.length -2)
    const cnpjDigit = cnpj.substring(cnpj.length -2)

    return `${cnpjTwo}.${cnpjTreeFirts}.${cnpjTreeSecond}/${cnpjTreeThird}-${cnpjDigit}`
  }

  async sanitizeCpf(cpf: string) {    
    const cpfTreeFirst = cpf.substring(0, 3)
    const cpfTreeSecond = cpf.substring(3, cpf.length - 5)
    const cpfTreeThird = cpf.substring(6, cpf.length - 2)
    const cpfDigit = cpf.substring(cpf.length -2)

    return `${cpfTreeFirst}.${cpfTreeSecond}.${cpfTreeThird}-${cpfDigit}`
  }
}