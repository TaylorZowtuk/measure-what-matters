import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Lineup } from "../db/entities/lineup.entity";
import { CreateLineupDTO } from "../dto/lineup/createLineup.dto";
import { LineupDTO } from "../dto/lineup/lineup.dto";

@Injectable()
export class LineupService{
    lineupRepo: Repository<Lineup>;

    constructor(@InjectRepository(Lineup) lineupRepo: Repository<Lineup>) {
        this.lineupRepo = lineupRepo;
      }

    /**
    * Saves a match lineup in database
    *
    * @param lineup - The lineup to be saved for the given match
    */

    async saveLineup(lineup: CreateLineupDTO) {
        if(!lineup.lineup){return new BadRequestException("Null lineup entered");}
        else if(!lineup.matchId){return new BadRequestException("Null matchId entered");}
        return await this.lineupRepo.save(lineup);
    }

    /**
    * Returns the lineup for a given match
    *
    * @param matchId: the matchId corresponding to the lineup we want
    *
    * @returns a Lineup DTO representing the desired lineup
    */

    async getLineupByMatch(matchId:number){
        if(!matchId){return new BadRequestException("Null value for matchId entered")}
        const lineup = await this.lineupRepo.findOne({
            where: {matchId:matchId}
        });
        return this.convertToDto(lineup);
    }

    /**
    * Converts a lineup entity to a lineup DTO
    *
    * @param lineup - The lineup we want to convert
    *
    * @returns A Lineup DTO of the lineup entity we converted
    */

    private convertToDto(lineup: any) {
        const lineupArray = lineup.lineup;
        const lineupDTO: LineupDTO = {
            lineupId : lineup.lineupId,
            lineup : lineupArray,
            matchId : lineup.matchId.matchId,
        }
        return lineupDTO;
    }
      
}
