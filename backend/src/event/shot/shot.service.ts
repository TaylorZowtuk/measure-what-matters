import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { match } from 'assert';
import { Shot } from 'src/db/entities/events/shot.entity';
import { ShotDTO } from 'src/dto/events/shot/shot.dto';
import { TeamsShotSummaryGameDTO } from 'src/dto/events/shot/teamShotSummaryGame';
import { Repository } from 'typeorm';
import { CreateShotDTO } from '../../dto/events/shot/createShot.dto';

@Injectable()
export class ShotService {
  constructor(
    @InjectRepository(Shot)
    private readonly shotRepo: Repository<Shot>,
  ) {}

  /**
   * Saves a shot event to the DB.
   *
   * @param shot - The goal we want to save to the DB
   */
  async saveShot(createShot: CreateShotDTO) {
    return this.shotRepo.save(createShot);
  }

  /**
   * Get shot DTOs by matchId
   *
   * @param matchId - The match we are querying for
   *
   * @returns converted shot DTOs
   */

  async getShotsByMatchId(matchId: number) {
    const shots: Shot[] = await this.shotRepo.find({ where: { matchId } });
    const shotsFilt = shots.filter(shot => shot.archived === false);
    return this.convertToDto(shotsFilt);
  }

  /**
   * Returns a summary of shots and shots on target for each team for a match
   *
   * @param matchId match we are looking for
   *
   * @returns DTO holding shots and shots on target for each team
   */

  async getTeamShotsSummaryByMatch(matchId: number) {
    const shots: ShotDTO[] = await this.getShotsByMatchId(matchId);
    let ourShots = 0,
      oppShots = 0,
      ourShotsOnTarget = 0,
      oppShotsOnTarget = 0;
    for (let i = 0; i < shots.length; i++) {
      if (shots[i].playerId) {
        ourShots++;
        if (shots[i].onTarget) {
          ourShotsOnTarget++;
        }
      } else {
        oppShots++;
        if (shots[i].onTarget) {
          oppShotsOnTarget++;
        }
      }
    }
    const shotTeamSummary: TeamsShotSummaryGameDTO = {
      matchId,
      ourShots,
      oppShots,
      ourShotsOnTarget,
      oppShotsOnTarget,
    };
    return shotTeamSummary;
  }

  /**
   * Converts shot entities to shot DTOs
   *
   * @param shots - The shots we want to convert
   *
   * @returns converted shot DTOs
   */

  private convertToDto(shots: Shot[]) {
    const shotDtos: ShotDTO[] = [];
    shots.forEach(shot => {
      const shotDto: ShotDTO = {
        id: shot.id,
        matchId: shot.matchId,
        time: shot.time,
        playerId: shot.playerId,
        onTarget: shot.onTarget,
      };
      shotDtos.push(shotDto);
    });
    return shotDtos;
  }
}
