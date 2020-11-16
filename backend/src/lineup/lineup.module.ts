import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Lineup } from '../db/entities/lineup.entity';
import { LineupService } from './lineup.service';
import { LineupController } from './lineup.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lineup])],
  controllers: [LineupController],
  providers: [LineupService],
})
export class LineupModule {}
