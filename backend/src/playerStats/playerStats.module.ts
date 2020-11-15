import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lineup } from '../db/entities/lineup.entity';
import { Match } from '../db/entities/match.entity';
import { Goal } from '../db/entities/events/goal.entity';
import { Substitution } from '../db/entities/events/substitution.entity';
import { Player } from '../db/entities/player.entity';
import { PlayerStatsController } from './playerStats.controller';
import { PlayerStatsService } from './playerStats.service';
import { Possession } from '../db/entities/events/possession.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Substitution,
      Goal,
      Player,
      Match,
      Lineup,
      Possession,
    ]),
  ],
  controllers: [PlayerStatsController],
  providers: [PlayerStatsService],
})
export class PlayerStatsModule {}
