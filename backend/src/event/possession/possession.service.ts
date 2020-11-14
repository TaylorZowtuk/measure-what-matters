import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Possession } from '../../db/entities/events/possession.entity';

@Injectable()
export class PossessionService {
  constructor(
    @InjectRepository(Possession)
    private readonly possessionRepo: Repository<Possession>,
  ) {}

  // create a neutral possession event
  public async createNeutralEvent(matchId: number, time: number) {
    return this.possessionRepo.save({ matchId, time, neutral: true });
  }

  // create a player possession event
  public async createPlayerEvent(
    matchId: number,
    time: number,
    playerId: number,
  ): Promise<Possession> {
    return this.possessionRepo.save({
      matchId,
      time,
      playerId,
      neutral: false,
    });
  }

  // create an opposition possession event
  public async createOppositionEvent(
    matchId: number,
    time: number,
  ): Promise<Possession> {
    return this.possessionRepo.save({ matchId, time });
  }

  // remove a possession event by ID
  public async removePossessionEventById(eventId: number): Promise<Possession> {
    const toArchive = await this.possessionRepo.findOneOrFail({ id: eventId });
    toArchive.archived = true;
    return this.possessionRepo.save(toArchive);
  }
}
