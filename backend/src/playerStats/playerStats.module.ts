import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Goal } from "../db/entities/events/goal.entity";
import { Substitution } from "../db/entities/events/substitution.entity";
import { Player } from "../db/entities/player.entity";
import { PlayerStatsController } from "./playerStats.controller";
import { PlayerStatsService } from "./playerStats.service";

@Module({
    imports: [TypeOrmModule.forFeature([Substitution, Goal, Player])],
    controllers: [PlayerStatsController],
    providers: [PlayerStatsService],
    exports: [PlayerStatsService],
})
export class PlayerStatsModule { }