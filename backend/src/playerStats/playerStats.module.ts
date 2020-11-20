import { Module } from '@nestjs/common';
import { PlayerStatsController } from './playerStats.controller';
import { PlayerStatsService } from './playerStats.service';

@Module({
  controllers: [PlayerStatsController],
  providers: [PlayerStatsService],
})
export class PlayerStatsModule {}
