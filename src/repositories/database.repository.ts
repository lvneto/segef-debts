
export interface DatabaseRepository {
  checkDatabaseAndUpdate: () => Promise<any>;
} 