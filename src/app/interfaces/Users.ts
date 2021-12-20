import { User } from './User';

export interface Users {
  limit: number;
  page: number;
  results: User[];
  totalPages: number;
  totalResults: number;
}
