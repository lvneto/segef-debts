import { Response } from 'express';

export const sanitizeUsersParameters = async(request: any, response: Response, next: any): Promise<any> => {

  if (request.query.document !== undefined) {
    request.query.document = request.query.document.replaceAll('-', '')
    request.query.document = request.query.document.replaceAll('.', '')
    request.query.document = request.query.document.replaceAll('/', '')
  } 
   
 next()
}
