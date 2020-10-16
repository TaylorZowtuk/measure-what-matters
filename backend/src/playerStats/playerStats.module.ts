import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Substitution } from "src/db/entities/events/substitution.entity";
import { PlayerStatsController } from "./playerStats.controller";
import { PlayerStatsService } from "./playerStats.service";

@Module({
    imports: [TypeOrmModule.forFeature([Substitution])],
    controllers: [PlayerStatsController],
    providers: [PlayerStatsService],
    exports: [PlayerStatsService],
})
export class PlayerStatsModule { }