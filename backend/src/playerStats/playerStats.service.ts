import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Substitution } from "src/db/entities/events/substitution.entity";
import { Repository } from "typeorm";

@Injectable()
export class PlayerStatsService{

    subRepo: Repository<any>;

    constructor(@InjectRepository(Substitution)
    subRepo: Repository<Substitution>) {
        this.subRepo = subRepo
    }

    /**
    * Retrieves seconds played by a player for a given match.
    *
    * @param playerId - The player we want to see time played
    * @param matchId - The match for which we want to see time played
    * 
    * @returns the time played in that match in seconds
    */

    async getSecondsPlayed(playerId:number, matchId:number) : Promise<number> {
        let timeOnField = 0;

        const query1 = this.subRepo.createQueryBuilder('substitution');

        query1.andWhere("substitution.playerId = :id1", {id1 : playerId});
        query1.andWhere("substitution.matchId = :id2", {id2 : matchId});
        const substitutions = await query1.getMany();

        for(let i=0; i<substitutions.length; i++){
            const time_on = (substitutions[i].timeOn);
            const time_off = (substitutions[i].timeOff);
            timeOnField+=(time_off-time_on);
        }


        return timeOnField;
    }


}
