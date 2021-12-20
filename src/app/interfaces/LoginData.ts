import { User } from './User';

export interface LoginData {
  user: User;
  tokens:
    | {
        access: {
          token: string;
          expires: string;
        };
        refresh: {
          token: string;
          expires: string;
        };
      }
    | undefined;
}

export interface TokenData {
  access: {
    token: string;
    expires: string;
  };
  refresh: {
    token: string;
    expires: string;
  };
}
