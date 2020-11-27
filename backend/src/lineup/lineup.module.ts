import { Module } from '@nestjs/common';
import { LineupService } from './lineup.service';
import { LineupController } from './lineup.controller';

@Module({
  controllers: [LineupController],
  providers: [LineupService],
})
export class LineupModule {}
