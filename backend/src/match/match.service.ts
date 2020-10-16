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

    /**
    * Saves a newly created match to the DB.
    *
    * @param match - The beginning of a new match session to be saved to database
    */

    async saveMatch(match: MatchDTO): Promise<number> {
        const { teamId, time, isHomeTeam } = match;

        const new_match = new Match(); 
        
        new_match.teamId = teamId;
        new_match.time = time;
        new_match.isHomeTeam = isHomeTeam;
        
        await this.matchRepo.save(new_match);

        return new_match.matchId;
    }

    /**
    * Retrieves a list of matches played by a team.
    *
    * @param teamId the id of the team we want to return matches for
    *
    * @returns A promise of a list of matches
    */
    
    async getMatches(teamId : number) : Promise<Match[]> {


        const query = this.matchRepo.createQueryBuilder('match');

        if (teamId){
            query.andWhere("match.teamId = :id", { id : teamId});
        }

        const matches = await query.getMany();
        
        for(let i=0; i<matches.length;i++){
            matches[i].teamId = teamId;
        } 

        return matches;

    }


    /* can be used to return match as DTO , for now returning whole match to get match ID
    private convertToDto(matches: any[]) {
        var matchDtos: MatchDTO[] = [];
        matches.forEach(element => {
          const matchDto: MatchDTO = {
            teamId: element.teamId,
            time: element.time,
            isHomeTeam: element.isHomeTeam,
          };
          matchDtos.push(matchDto);
        });
        return matchDtos;
      }
    */

}