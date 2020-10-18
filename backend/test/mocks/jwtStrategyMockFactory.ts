import { JwtService } from '@nestjs/jwt';
import { MockType } from './mockType';

export const jwtStrategyMockFactory: () => MockType<JwtService> = jest.fn(
  () => ({
    sign: jest.fn(),
    signAsync: jest.fn(),
    verify: jest.fn(),
    verifyAsync: jest.fn(),
    decode: jest.fn(),
  }),
);
