import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Substitution } from '../../db/entities/events/substitution.entity';
import { SubstitutionExchangeDTO } from '../../dto/events/substitution/substitution-exchange.dto';
import { SubstitutionDTO } from '../../dto/events/substitution/substitution.dto';

@Injectable()
export class SubstitutionService {
  constructor(
    @InjectRepository(Substitution)
    private readonly substitutionRepo: Repository<Substitution>,
  ) {}

  /**
   * Creates subs for the starting lineup
   *
   * @param substitutionDtos - The substitutions to add to the DB
   *
   */
  async createStartingSubs(subs: SubstitutionDTO[]) {
    await this.substitutionRepo.save(subs);
  }

  /**
   * Saves a substitution event to the DB
   *
   * @param subIn - The substitution dto for the player coming in
   * @param subOut - The substitution dto for the player going out
   *
   */
  async saveSubstitution(subExchange: SubstitutionExchangeDTO) {
    const subIn: SubstitutionDTO = {
      playerId: subExchange.playerIdIn,
      matchId: subExchange.matchId,
      timeOn: subExchange.time,
    };
    await this.substitutionRepo.save(subIn);

    await this.substitutionRepo.update(
      {
        playerId: subExchange.playerIdOut,
        timeOff: null,
      },
      {
        timeOff: subExchange.time,
      },
    );
  }
}
