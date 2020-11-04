import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assist } from '../../db/entities/events/assist.entity';
import { AssistDTO } from '../../dto/events/assist/assist.dto';
import { CreateAssistDTO } from '../../dto/events/assist/createAssist.dto';

@Injectable()
export class AssistService {
  assistRepo: Repository<any>;

  constructor(
    @InjectRepository(Assist)
    assistRepo: Repository<Assist>,
  ) {
    this.assistRepo = assistRepo;
  }

  /**
   * Saves an assist event to database
   *
   * @param assist - the assist to be saved in database
   */
  async saveAssist(assist: CreateAssistDTO) {
    return this.assistRepo.save(assist);
  }

  /**
   * Retrieves all assists recorded by a player
   *
   * @param playerId - The player which we want the list of assists for
   *
   * @returns A promise of a list of assists
   */
  async getAssistByPlayerId(playerId: number) {
    const assists: Assist[] = await this.assistRepo.find({
      where: { playerId: playerId },
    });
    return this.convertToDto(assists);
  }

  /**
   * Retrieves all assists recorded by a player
   *
   * @param matchId - The match which we want the list of assists for
   *
   * @returns A promise of a list of assists
   */
  async getAssistByMatchId(matchId: number) {
    const assists: Assist[] = await this.assistRepo.find({
      where: { matchId: matchId },
    });
    return this.convertToDto(assists);
  }

  /**
   * Retrieves all assists recorded by a player
   *
   * @param matchId - The match which we want the list of assists for
   * @param playerId - The player which we want the list of assists for
   *
   * @returns A promise of a list of assists
   */

  async getAssistByPlayerAndMatch(playerId: number, matchId: number) {
    const assists: Assist[] = await this.assistRepo.find({
      where: { matchId: matchId, playerId: playerId },
    });
    return this.convertToDto(assists);
  }

  /**
   * converts an array of assists into an array of assist DTOs
   *
   * @param assists : the array of assists we want to convert
   *
   * @returns A promise of a list of assist DTOs
   */

  private convertToDto(assists: any[]) {
    const assistDtoArray: AssistDTO[] = [];
    assists.forEach(assist => {
      const assistDTO: AssistDTO = {
        matchId: assist.matchId.matchId,
        playerId: assist.playerId.playerId,
        time: assist.time,
        id: assist.id,
      };
      assistDtoArray.push(assistDTO);
    });
    return assistDtoArray;
  }
}
