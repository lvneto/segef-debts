import { prisma } from '../../prisma';
import { UsersRepository } from '../users.repository';

export class PrismaUsersRepository implements UsersRepository {
  async findUsers( skip:number, take: number): Promise<any> {
    let users = await prisma.users.findMany({
      skip: skip || 0,
      take: take || 30,
    })
    users = await this.usersSanitize(users)
    return users
  }

  async usersSanitize (users: any): Promise<any> {
    let arrayOfUsers = []    
  
    for (let user of users) {    
      user.users = user.users.replaceAll('$', ',')
      //separed ua_jurisdiction from name
      user.ua_jurisdiction = user.users.substring(2, 9)
      //remove 1 and , from start string
      user.users = user.users.substring(9) 
      //remove last digit and space from end string
      user.users = user.users.substring(0, user.users.length - 6)
      //turn string in a array
      user.users = user.users.split(',')
      user.name = user.users[0]
      //taking cpf from inside name
      user.cpf = user.name.substring(user.name.length - 11)
      //taking name without cpf
      user.name = user.name.substring(0, user.name.length - 12)
      //separed cnae from cnpj
      user.cnae = user.users[1].substring(0, user.users[1].length - 14)
      //separed cnpj from cnae
      user.cnpj = user.users[1].substring(7)    
      //separed logradouro from complement  
      user.logradouro = user.users[2].slice(0, user.users[2].indexOf(' '))
      //separed complement from logradouro
      user.complement = user.users[2].slice(user.users[2].indexOf(' ') + 1)
      user.zone = user.users[4]
      //separed code_city from city
      user.city_code = user.users[5].slice(0, user.users[5].indexOf(' '))
      //separed city from code_city
      user.city = user.users[5].slice(user.users[5].indexOf(' ') + 1)
      //separed state from another things
      user.state = user.users[6].substr(0, 2)
      //separed zip_code from another things
      user.zip_code = user.users[6].substr(2, 8)
      arrayOfUsers.push(user)        
    }   
    
    return arrayOfUsers
  }
}