import { prisma } from '../../prisma';
import { UsersRepository } from '../users.repository';

export class PrismaUsersRepository implements UsersRepository {

  async findUsers(skip: number, take: number): Promise<any> {
    return await prisma.users.findMany({
      skip: skip || 0,
      take: take || 30,      
    })
  }

  async checkDatabaseAndUpdate(): Promise<any> {
    let users = await prisma.users.findMany({
      where: {
        name: null
      }
    })
    return users = await this.usersSanitize(users)
  }

  async usersSanitize (users: any): Promise<any> {
    let arrayOfUsers = []    
  
    for (let user of users) {    
      if (user.users.length <= 121) {
        users.pop(user)
        await this.removeUser(user.id)
      } else {
        user.users = user.users.replaceAll('#', ',') 
        user.users = user.users.split(',')                
        //take values from array
        user.register_type = user.users[0]
        user.ua_jurisdiction = user.users[1].substring(0, 7)
        user.name = user.users[1].substring(7) && user.users[1].substring(7, user.users[1].length - 12)
        user.cpf = user.users[1].substring(user.users[1].length - 11) 
        user.cnpj = user.users[2].substring(user.users[2].length - 14)
        user.cnae = user.users[2].substring(user.users[2].length - 7)
        user.logradouro_type = user.users[3].substring(0, 3)
        user.logradouro = user.users[3].substring(3)
        user.number = user.users[4].substring(user.users[4].length - 4)
        user.complement = user.users[4].substring(6, user.users[4].length - 5)     
        user.zone = user.users[5]
        user.city_code = user.users[6].substring(0, 3)
        user.city = user.users[6].substring(4)
        user.state = user.users[7].substring(0, 2)
        user.zip_code = user.users[7].substring(2, 10)
        user.debts = user.users[7].substring(10, user.users[7].length - 68)
        user.release_debts = user.users[7].substring(12, user.users[7].length - 66)
        user.debt_type = user.users[7].substring(14, user.users[7].length - 64)
        user.due_date = user.users[7].substring(16, user.users[7].length - 56)
        user.umv = user.users[7].substring(24, user.users[7].length - 52)
        user.main_debt = user.users[7].substring(29, user.users[7].length - 31).replaceAll('$', ',')
        user.apuration_period = user.users[7].substring(47, user.users[7].length - 25)
        user.declaration = user.users[7].substring(57, user.users[7].length - 8)
        user.started_count_prescription_date = user.users[7].substring(72)
        user.article = user.users[8].replaceAll('$', ',')    
        user.mora_tax = user.users.slice(user.users.length - 2)[0].substring(2, user.users.length - 2)  
        user.users = {}                
        arrayOfUsers.push(user)  
      }           
    }         
    return arrayOfUsers
  }

  async insertUsers (users: any): Promise<any> {    
    let usersUpdate = []
    for (const user of users) {      
        usersUpdate.push(user)
        await prisma.users.update({
          where: {
            id: user.id
          },
          data: {
            register_type: user.register_type,
            name: user.name,
            cpf: user.cpf,
            cnpj: user.cnpj,
            cnae: user.cnae,
            logradouro: user.logradouro,
            complement: user.complement,
            zone: user.zone,
            city_code: user.city_code,
            city: user.city,
            state: user.state,
            zip_code: user.zip_code,
            ua_jurisdiction: user.ua_jurisdiction,
            debts: user.debts,          
            article : user.article     
          }
        })       
      continue
    }   
    return usersUpdate
  }

  async removeUser (id: any): Promise<any> {
    return await prisma.users.delete({
      where: {
        id
      }
    })
  }

  async findNextArticle (users: any): Promise<any> {
    let article = ''
    for (let i = 10; i < 25; i ++) {
      if (users[i] && users[i].length > 0) {
        article += users[i]        
      }
    }
    return article
  }
}