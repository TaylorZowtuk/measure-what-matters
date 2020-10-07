import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  public static get(key: string): string {
    return process.env[key];
  }
  public get(key: string): string {
    return process.env[key];
  }
}
