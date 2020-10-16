import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/db/entities/match.entity';
import { MatchDTO } from 'src/dto/match/match.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MatchService {
    matchRepo: Repository<any>;

    constructor(@InjectRepository(Match)
    matchRepo: Repository<Match>) {
        this.matchRepo = matchRepo
    }

    async saveMatch(match: MatchDTO): Promise<Number> {
        const { teamId, time, isHomeTeam } = match;

        const new_match = new Match(); 
        
        new_match.teamId = teamId;
        new_match.time = time;
        new_match.isHomeTeam = isHomeTeam;
        
        await this.matchRepo.save(new_match);

        return new_match.matchId;
    }


    async getMatches(teamId : number) : Promise<Match[]> {


        const query = this.matchRepo.createQueryBuilder('match');

        if (teamId){
            query.andWhere("match.teamId = :id", { id : teamId});
        }

        const players = await query.getMany(); 

        return players;

    }

}
