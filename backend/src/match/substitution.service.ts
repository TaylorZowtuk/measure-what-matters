import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Substitution } from "src/db/entities/events/substitution.entity";
import { SubstitutionDTO } from "src/dto/events/substitution.dto";
import { Repository } from "typeorm";

@Injectable()
export class SubstitutionService {
    subRepo: Repository<any>;

    constructor(@InjectRepository(Substitution)
    subRepo: Repository<Substitution>) {
        this.subRepo = subRepo
    }

    async saveSub(substitution: SubstitutionDTO) {
        await this.subRepo.save(substitution);
    }

    

}
