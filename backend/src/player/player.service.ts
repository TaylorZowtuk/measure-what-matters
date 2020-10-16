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

    async savePlayer(player: PlayerDTO) {
        await this.playerRepo.save(player);
    }

    async getPlayers(teamId : number) : Promise<Player[]> {


        const query = this.playerRepo.createQueryBuilder('player');

        if (teamId){
            query.andWhere("player.teamId = :id", { id : teamId});
        }

        const players = await query.getMany(); 

        return players;

    }

}
