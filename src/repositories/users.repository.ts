export interface UserCreateData {
  id:              number;
  ua_jurisdiction: string;
  name:            string;
  cpf:             string;
  cnae:            string;
  cnpj:            string;
  logradouro:      string;
  complement:      string;
  zone:            string;
  city_code:       string;
  city:            string;
  state:           string;
  zip_code:        string;
  debts:           string;
  mei_inscription: string;
  article:         string;
  users:           string;
}

export interface UsersRepository {
  findUser: (skip: number, take: number, doc: string) => Promise<any>;
} 