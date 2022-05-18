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
    let users = await prisma.users.findMany()
    return users = await this.usersSanitize(users)
  }

  async usersSanitize (users: any): Promise<any> {
    let arrayOfUsers = []    
  
    for (let user of users) {    

      if (user.users.length <= 121) {
        users.pop(user)
        await this.remove(user)
      } else {
        user.users = user.users.replaceAll('#', ',')    
        user.users = user.users.split(',')
        //take values from array
        user.register_type = user.users[0]
        user.ua_jurisdiction = user.users[1].substring(0, 7)
        user.name = user.users[1].substring(7) && user.users[1].substring(7, user.users[1].length - 11)
        user.cpf = user.users[1].substring(user.users[1].length - 11) 
        user.cnpj = user.users[2].substring(user.users[2].length - 14)
        user.cnae = user.users[2].substring(0, user.users[2].length - 14)
        user.logradouro = user.users[3]
        user.complement = user.users[3]      
        user.zone = user.users[5]
        user.city_code = user.users[6].substring(0, 3)
        user.city = user.users[6].substring(3)
        user.state = user.users[7].substring(0, 2)
        user.zip_code = user.users[7].substring(2, 10)
        arrayOfUsers.push(user)  
      }           
    }   
    await this.insertUsers(arrayOfUsers)
    return arrayOfUsers
  }

  async insertUsers (users: any): Promise<any> {    
    for (const user of users) {
      const check = await this.checkToUpdate(user.id) 
      if (check) {
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
            ua_jurisdiction: user.ua_jurisdiction
          }
        })
      } 
      continue
    }   
    return users
  }

  async remove (user: any): Promise<any> {
    return await prisma.users.delete({
      where: {
        id: user
      }
    })
  }

  async checkToUpdate (id: any): Promise<any> {
    const check = await prisma.users.findUnique({
      where: {
        id
      }
    })
    if (check && check.name === null) { 
      return true
    } else {
      return false
    }    
  }
}