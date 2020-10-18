import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { EventModule } from './event/event.module';
import { TeamController } from './team/team.controller';
import { TeamModule } from './team/team.module';
import { MatchModule } from './match/match.module';
import { PlayerModule } from './player/player.module';
import { PlayerStatsModule } from './playerStats/playerStats.module';

@Module({
  imports: [DbModule, EventModule, MatchModule, PlayerModule, PlayerStatsModule, TeamModule],
  controllers: [TeamController],
})
export class AppModule {}
