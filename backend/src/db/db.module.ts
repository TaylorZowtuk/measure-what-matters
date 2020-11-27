import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Entities from './entities/Index';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature(Object.values(Entities)),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class DbModule {}
