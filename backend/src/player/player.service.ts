import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from '../db/entities/player.entity';
import { PlayerDTO } from '../dto/player/player.dto';
import { Repository } from 'typeorm';
import { CreatePlayerDTO } from '../dto/player/createPlayer.dto';
import { UpdatePlayerDTO } from 'src/dto/player/updatePlayer.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
  ) {}

  /**
   * Saves a newly created player to the DB.
   *
   * @param player - The new team player to be saved to database
   */

  async savePlayer(players: CreatePlayerDTO[]) {
    const jerseyNums: number[] = [];
    for (let i = 0; i < players.length; i++) {
      jerseyNums.push(players[i].jerseyNum);
    }
    const notUnique = await this.uniqueJerseyTeam(
      players[0].teamId,
      jerseyNums,
    );
    if (notUnique != null) {
      throw new BadRequestException(
        'Jersey number ' + notUnique + ' is already taken',
      );
    }
    return this.playerRepo.save(players);
  }

  /**
   * Checks to make sure that the jerseyNum is not taken for the team
   *
   * @param teamId team we are searching to see if jerseyNum unique for
   * @param jerseyNum jersey number we are seeing if already taken
   *
   * @returns A promise of a list of players
   */

  async uniqueJerseyTeam(teamId: number, jerseyNum: number[]) {
    const players: PlayerDTO[] = await this.getPlayersByTeamId(teamId);
    for (let i = 0; i < players.length; i++) {
      if (jerseyNum.includes(players[i].jerseyNum)) {
        return players[i].jerseyNum;
      }
    }
  }

  /**
   * Retrieves a list of players on a team.
   *
   * @param teamId the id of the team we want to return matches for
   *
   * @returns A promise of a list of players
   */

  async getPlayersByTeamId(teamId: number): Promise<PlayerDTO[]> {
    const players: Player[] = await this.playerRepo.find({
      where: { teamId: teamId },
    });

    return this.convertToDto(players);
  }

  /**
   * Retrieves a list of players by their Ids
   *
   * @param playerIds the ids of the players we want to return
   *
   * @returns A promise of a list of players
   */

  async getPlayers(playerIds: number[]): Promise<Player[]> {
    const players: Player[] = [];
    for (let i = 0; i < playerIds.length; i++) {
      const player: Player = await this.playerRepo.findOne({
        where: { playerId: playerIds[i] },
      });
      if (player.archived === false) {
        players.push(player);
      }
    }
    return players;
  }

  /**
   * Deletes a player entity
   *
   * @param playerId: ID of the player to be deleted
   *
   * @returns updated player object with archived true (we are keeping removed objects in database with different flag)
   */

  async removePlayerById(playerId: number): Promise<Player> {
    const playerRemove = await this.playerRepo.findOneOrFail({ playerId });
    playerRemove.archived = true;
    return this.playerRepo.save(playerRemove);
  }

  /**
   * Updates a player object
   *
   * @param updatePlayer - object containing player update
   *
   * @returns updated player
   */

  async updatePlayer(updatePlayer: UpdatePlayerDTO): Promise<Player> {
    const jerseyNums: number[] = [updatePlayer.jerseyNum];
    const player = await this.playerRepo.findOneOrFail({
      where: { playerId: updatePlayer.playerId },
    });
    const notUnique = await this.uniqueJerseyTeam(player.teamId, jerseyNums);
    if (notUnique != null) {
      throw new BadRequestException(
        'Jersey number ' + notUnique + ' is already taken',
      );
    }
    player.teamId = updatePlayer.teamId;
    player.firstName = updatePlayer.firstName;
    player.lastName = updatePlayer.lastName;
    player.jerseyNum = updatePlayer.jerseyNum;
    return this.playerRepo.save(player);
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
