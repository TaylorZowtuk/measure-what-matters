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

    async savePlayer(player: PlayerDTO) {
        await this.playerRepo.save(player);
    }

    /**
    * Retrieves a list of players on a team.
    *
    * @param teamId the id of the team we want to return matches for
    *
    * @returns A promise of a list of players
    */

    async getPlayers(teamId : number) : Promise<Player[]> {


        const query = this.playerRepo.createQueryBuilder('player');

        if (teamId){
            query.andWhere("player.teamId = :id", { id : teamId});
        }

        const players = await query.getMany(); 

        for(let i=0; i<players.length;i++){
            players[i].teamId = teamId;
        } 

        return players;

    }

}
