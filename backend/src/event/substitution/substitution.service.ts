import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Substitution } from '../../db/entities/events/substitution.entity';
import { SubstitutionExchangeDTO } from '../../dto/events/substitution/substitution-exchange.dto';
import { SubstitutionDTO } from '../../dto/events/substitution/substitution.dto';

@Injectable()
export class SubstitutionService {
    substitutionRepo: Repository<Substitution>;

    constructor(
        @InjectRepository(Substitution) 
        substitutionRepo: Repository<Substitution>
    ) {
        this.substitutionRepo = substitutionRepo;  
    }

    /**
     * Creates subs for the starting lineup
     * 
     * @param substitutionDtos - The substitutions to add to the DB
     * 
     * @returns The substitution events added to the db
     */
    async createStartingSubs(subs: SubstitutionDTO[]) {
        return await this.substitutionRepo.save(subs);
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
            timeOn: subExchange.time
        }
        await this.substitutionRepo.save(subIn);
        
        await this.substitutionRepo.createQueryBuilder()
            .update(Substitution)
            .set({ timeOff: subExchange.time })
            .where("playerId = :playerId", { playerId: subExchange.playerIdOut})
            .andWhere("timeOff IS NULL")
            .execute();
    }

}
