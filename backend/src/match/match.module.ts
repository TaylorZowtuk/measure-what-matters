import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Substitution } from "src/db/entities/events/substitution.entity";
import { Match } from "src/db/entities/match.entity";
import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";
import { SubstitutionService } from "./substitution.service";


@Module({
    imports: [TypeOrmModule.forFeature([Match, Substitution])],
    controllers: [MatchController],
    providers: [MatchService, SubstitutionService],
    exports: [MatchService, SubstitutionService],
})
export class MatchModule { }