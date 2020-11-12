import { RequestUser } from '../../src/types/requestUser.type';

export const mockUserNotLoggedIn: RequestUser = {
  user: undefined,
} as RequestUser;

export const mockUserLoggedIn: RequestUser = {
  user: {
    userId: 1,
    username: 't',
  },
};
