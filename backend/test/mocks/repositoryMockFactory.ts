/* eslint-disable */
import { Repository } from 'typeorm';
import { MockType } from './mockType';

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    create: jest.fn(),
  }),
);
