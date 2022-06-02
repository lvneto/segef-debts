import { prisma } from '../../prisma';
import { UsersRepository } from '../users.repository';

export class PrismaUsersRepository implements UsersRepository {

  async findUser (skip: number, take: number, document: string): Promise<any> { 
     
    const users = await prisma.users.findMany({       
      distinct: ['name'],
      where: {       
        OR:  [{ cnpj: document }, { cpf: document }]           
      },    
      skip: skip || 0,
      take: take || 100,
      orderBy: {
        started_count_prescription_date: 'desc'
      }  
    })

    const totalUserRegisters = await prisma.users.count({
      where: {
        OR: [{ cnpj: document }, { cpf: document }]
      }
    })  

    const distinctCitys = await prisma.users.findMany({
      distinct: ['city'], 
      select: {
        city: true
      },
      where: {       
        OR:  [{ cnpj: document }, { cpf: document }]           
      },   
    })   
     
    return await this.sanitizeAndCount(users, totalUserRegisters, distinctCitys)
  }

  async sanitizeAndCount(users: any, totalUserRegisters: number, distinctCitys: any) {
    let usersData = {} as any
    let countTotalDebt = 0

    for (const user of users) {
      user.cnpj = await this.sanitizeCnpj(user.cnpj)
      user.cpf = await this.sanitizeCpf(user.cpf)
      user.due_date = await this.sanitizeFullyDate(user.due_date)
      user.started_count_prescription_date = await this.sanitizeFullyDate(user.started_count_prescription_date)
      user.users = {}
      countTotalDebt += parseFloat(user.main_debt)
    }

    usersData.totalUserRegisters = totalUserRegisters
    usersData.totalMainDebt = countTotalDebt
    usersData.distinctCitys = distinctCitys
    usersData.users = users        
    
    return usersData
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