import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { query } from "express";
import { Substitution } from "src/db/entities/events/substitution.entity";
import { Repository } from "typeorm";

@Injectable()
export class PlayerStatsService{

    subRepo: Repository<any>;

    constructor(@InjectRepository(Substitution)
    subRepo: Repository<Substitution>) {
        this.subRepo = subRepo
    }

    async getSecondsPlayed(playerId:number, matchId:number) : Promise<number> {
        var timeOnField = 0;

        const query1 = this.subRepo.createQueryBuilder('substitution');

        query1.andWhere("substitution.playerId = :id1", {id1 : playerId});
        query1.andWhere("substitution.matchId = :id2", {id2 : matchId});
        const substitutions = await query1.getMany();

        console.log(substitutions);

        for(var i=0; i<substitutions.length; i++){
            const time_on = (substitutions[i].timeOn);
            const time_off = (substitutions[i].timeOff);
            timeOnField+=(time_off-time_on);
        }


        return timeOnField;
    }


}
