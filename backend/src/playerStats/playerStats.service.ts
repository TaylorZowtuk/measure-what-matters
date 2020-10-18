import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Goal } from "../db/entities/events/goal.entity";
import { Substitution } from "../db/entities/events/substitution.entity";
import { Player } from "../db/entities/player.entity";
import { PlayerDTO } from "../dto/player/player.dto";
import { Repository } from "typeorm";
import { PlayerTimeDTO } from "src/dto/stats/playerTime.dto";
import { Match } from "src/db/entities/match.entity";
@Injectable()
export class PlayerStatsService{

    subRepo: Repository<any>;
    goalRepo: Repository<any>;
    playerRepo: Repository<any>;
    matchRepo: Repository<any>;

    constructor(@InjectRepository(Substitution)
    subRepo: Repository<Substitution>, 
    @InjectRepository(Goal)
    goalRepo: Repository<Goal>,
    @InjectRepository(Player)
    playerRepo : Repository<Player>,
    @InjectRepository(Match)
    matchRepo : Repository<Match>
    ) {
        this.subRepo = subRepo;
        this.goalRepo = goalRepo;
        this.playerRepo = playerRepo;
        this.matchRepo = matchRepo;
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

    async getPlayersTimes(matchId:number) : Promise<PlayerTimeDTO[]> {
        const playerTimeDtos: PlayerTimeDTO[] = [];
        const match = await this.matchRepo.findOne(
            {where: {matchId:matchId}}
        );
        const teamId = match.teamId.teamId;
        
        const players = await this.playerRepo.find(
            {where: {teamId:teamId}}
        );

        console.log(players);

        for(let i=0; i<players.length;i++){

            const playerId = players[i].playerId;
            const name = players[i].name;
            const jerseyNum = players[i].jerseyNum;
            const secondsPlayed = await this.getSecondsPlayed(players[i].playerId, matchId);
            //const secondsPlayed = 100;
            const player_time_DTO: PlayerTimeDTO = {playerId:playerId, teamId:teamId, name:name, jerseyNum:jerseyNum, secondsPlayed:secondsPlayed};
        
            playerTimeDtos.push(player_time_DTO); 
        }

        return playerTimeDtos;
    }

    /**
    * Retrieves an array of players on the field at the time of a goal.
    *
    * @param goalId - The id for the goal scored
    * 
    * @returns the DTO array of players on the field during the time of the goal
    */

    async getPlayersOnForGoal(goalId: number) : Promise<PlayerDTO[]> {
        const players: Player[] = [];

        const query1 = this.goalRepo.createQueryBuilder('goal');

        query1.andWhere("goal.id = :id1", {id1:goalId});

        const goal = await query1.getOne();

        for(let i=0; i<goal.lineup.length; i++){
            const player: Player = await this.playerRepo.findOne(
                {where: {playerId : goal.lineup[i]}});
            players.push(player);
            
        }

        return this.convertToPlayerDto(players);
    }

    /**
    * Converts a list of player entities to a list of player dtos
    *
    * @param players - The list of player entities we want to convert to a list of player DTOs
    *
    * @returns A list of player dtos converted from an entity
    */

    private convertToPlayerDto(players: any[]) {
        const playerDtos: PlayerDTO[] = [];
        players.forEach(element => {
          const playerDto: PlayerDTO = {
            playerId: element.playerId,
            teamId: element.teamId.teamId,
            name: element.name,
            jerseyNum: element.jerseyNum,
          };
          playerDtos.push(playerDto);
        });
        return playerDtos;
    }


}
