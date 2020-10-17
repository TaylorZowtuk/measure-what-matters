import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { EventModule } from './event/event.module';
import { TeamController } from './team/team.controller';
import { TeamModule } from './team/team.module';

@Module({
  imports: [DbModule, EventModule, TeamModule],
  controllers: [TeamController],
})
export class AppModule {}
