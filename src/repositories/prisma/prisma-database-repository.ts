import { prisma } from '../../prisma';
import { DatabaseRepository } from '../database.repository';

export class PrismaDatabaseRepository implements DatabaseRepository {

  async checkDatabaseAndUpdate(): Promise<any> {
    let users = await prisma.users.findMany({
      where: {
        OR: [{cpf: null}, {cnpj: null}]
      }
    })
    return users = await this.usersSanitize(users)
  }

  async usersSanitize (users: any): Promise<any> {         
    
    for (let user of users) {  

      user.users = user.users.replaceAll(/\s\s+/g,'{');
      
      if (user.users.length <= 22) {
        await this.removeUser(user.id)
        users.pop(user.id)  
      } else {      
        
        user.users = user.users.replaceAll('#',';');
        user.users = user.users.replaceAll('$',',');
        user.users = user.users.replaceAll('|','"');
        user.users = user.users.split('{');

        user.register_type = user.users[0]
        user.ua_jurisdiction = user.users[1].substring(0, 7)
        user.name = user.users[1].substring(7, user.users[1].length - 12)
        user.cnpj = user.users[2].substring(0, 14)
        user.cnae = user.users[2].substring(user.users[2].length - 7)
        user.cpf = user.users[1].substring(user.users[1].length - 11)
        user.logradouro_type = user.users[3].substring(0, 3)
        user.logradouro = user.users[3].substring(3)
        user.number_house = user.users[4].substring(user.users[4].length - 4)
        user.complement = user.users[4].substring(6)    
        user.zone_city = user.users[5]
        user.city_code = user.users[6].substring(0, 3)
        user.city = user.users[6].substring(4)
        user.state = user.users[7].substring(0, 2)
        user.zip_code = user.users[7].substring(2, 10)
        user.debts = user.users[7].substring(10, user.users[7].length - 68)
        user.release_debts = user.users[7].substring(12, user.users[7].length - 66)
        user.debt_type = user.users[7].substring(14, user.users[7].length - 64)
        user.due_date = await this.sanitizeFullyData(user.users[7].substring(16, user.users[7].length - 56))  
        user.umv = user.users[7].substring(24, user.users[7].length - 52)
        user.main_debt = parseFloat(user.users[7].substring(29, user.users[7].length - 31))
        user.apuration_period = await this.sanitizePartialDate(user.users[7].substring(49, user.users[7].length - 25))
        user.declaration = user.users[7].substring(55, user.users[7].length - 8)
        user.started_count_prescription_date = await this.sanitizeFullyData(user.users[7].substring(72)) 
        user.article = user.users[8]  
        user.mora_tax = user.users.slice(user.users.length - 2)[0].substring(2, user.users.length - 2)    
        user.users = {}        
      }                               
    }          
            
    return await this.insertUsers(users)
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
            register_type : user.register_type,
            ua_jurisdiction : user.ua_jurisdiction,
            name : user.name,
            cpf : user.cpf,
            cnpj : user.cnpj,
            cnae : user.cnae,
            logradouro_type : user.logradouro_type,
            logradouro : user.logradouro,
            number_house : user.number_house,
            complement : user.complement, 
            zone_city : user.zone_city,
            city_code : user.city_code,
            city : user.city,
            state : user.state,
            zip_code : user.zip_code,
            debts : user.debts,
            release_debts : user.release_debts,
            debt_type : user.debt_type,
            due_date : user.due_date,
            umv : user.umv,
            main_debt : user.main_debt,
            apuration_period : user.apuration_period,
            declaration : user.declaration,
            started_count_prescription_date : user.started_count_prescription_date,
            article : user.article,   
            mora_tax : user.mora_tax 
          }
        })    
    }   
    return usersUpdate
  }

  async sanitizeFullyData(date: string) {
    const year = date.substring(0, date.length - 4)
    const month = date.substring(4, date.length - 2)
    const day = date.substring(6)

    const newDate = `${year}-${month}-${day}`
    return new Date(newDate) 
  }

  async sanitizePartialDate(date: string) {

    const year = date.substring(0, 4)
    const month = date.substring(4, 2)

    const newDate = `${month}/${year}`
    return newDate
  }

  async removeUser(id: number) {
    return await prisma.users.delete({
      where: {
        id
      }
    })
  }
}

