import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/db/entities/player.entity';
import { PlayerDTO } from 'src/dto/player/player.dto';
import { Repository } from 'typeorm';

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

    async savePlayer(player: PlayerDTO) : Promise<void> {
        return await this.playerRepo.save(player);
    }

    /**
    * Retrieves a list of players on a team.
    *
    * @param teamId the id of the team we want to return matches for
    *
    * @returns A promise of a list of players
    */

    async getPlayers(teamId : number) : Promise<PlayerDTO[]> {

        const query = this.playerRepo.createQueryBuilder('player');

        if (teamId){
            query.andWhere("player.teamId = :id", { id : teamId});
        }

        const players = await query.getMany(); 

        for(let i=0; i<players.length;i++){
            players[i].teamId = teamId;
        } 

        return this.convertToDto(players);

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
            teamId: element.teamId,
            name: element.name,
            jerseyNum: element.jerseyNum,
          };
          playerDtos.push(playerDto);
        });
        return playerDtos;
    }
}