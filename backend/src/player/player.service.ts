import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../db/entities/player.entity';
import { PlayerDTO } from '../dto/player/player.dto';
import { Repository } from 'typeorm';
import { CreatePlayerDTO } from '../dto/player/createPlayer.dto';

@Injectable()
export class PlayerService {
    playerRepo: Repository<any>;

    constructor(@InjectRepository(Player)
    playerRepo: Repository<Player>) {
        this.playerRepo = playerRepo
    }

    /**
    * Saves a newly created player to the DB.
    *
    * @param player - The new team player to be saved to database
    */

    async savePlayer(players: CreatePlayerDTO[]) : Promise<Player[]> {
        const playersSaved: Player[] = [];
        for(let i=0; i<players.length; i++){
            const player:Player = await this.playerRepo.save(players[i]);
            playersSaved.push(player);
        }
        return playersSaved;  
    }

    /**
    * Retrieves a list of players on a team.
    *
    * @param teamId the id of the team we want to return matches for
    *
    * @returns A promise of a list of players
    */

    async getPlayersByTeamId(teamId : number) : Promise<PlayerDTO[]> {

    const players: Player[] = await this.playerRepo.find(
        {where: {teamId : teamId}});
    
        return this.convertToDto(players);

    }

    /**
    * Retrieves a list of players by their Ids
    *
    * @param playerIds the ids of the players we want to return
    *
    * @returns A promise of a list of players
    */

   async getPlayers(playerIds : number[]) : Promise<Player[]> {
       const players: Player[] = [];
        for(let i=0; i<playerIds.length; i++){
            const player:Player = await this.playerRepo.findOne({
                where: {playerId: playerIds[i]}
            });
            players.push(player);
        }
        return players;
    }

    /**
    * Converts a list of player entities to a list of player dtos
    *
    * @param players - The list of player entities we want to convert to a list of player DTOs
    *
    * @returns A list of player dtos converted from an entity
    */

    private convertToDto(players: any[]) {
        const playerDtos: PlayerDTO[] = [];
        players.forEach(element => {
          const playerDto: PlayerDTO = {
            playerId: element.playerId,
            teamId: element.teamId.teamId,
            firstName: element.firstName,
            lastName: element.lastName,
            jerseyNum: element.jerseyNum,
          };
          playerDtos.push(playerDto);
        });
        return playerDtos;
    }
}