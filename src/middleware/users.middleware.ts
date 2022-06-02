import { Response } from 'express';

export const sanitizeUsersParameters = async(request: any, response: Response, next: any): Promise<any> => {

  if (request.query.doc !== undefined) {
    request.query.doc = request.query.doc.replaceAll('-', '')
    request.query.doc = request.query.doc.replaceAll('.', '')
    request.query.doc = request.query.doc.replaceAll('/', '')
  } 
   
 next()
}
