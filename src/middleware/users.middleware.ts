import { Response } from 'express';

export const sanitizeUsersParameters = async(request: any, response: Response, next: any): Promise<any> => {

  if (request.query.cnpj !== undefined) {
    request.query.cnpj = request.query.cnpj.replaceAll('-', '')
    request.query.cnpj = request.query.cnpj.replaceAll('.', '')
    request.query.cnpj = request.query.cnpj.replaceAll('/', '')
  }

  if (request.query.cpf !== undefined) {
    request.query.cpf = request.query.cpf.replaceAll('-', '')
    request.query.cpf = request.query.cpf.replaceAll('.', '')
    request.query.cpf = request.query.cpf.replaceAll('/', '')
  }
   
 next()
}
