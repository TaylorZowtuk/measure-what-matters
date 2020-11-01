import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Assist } from '../../db/entities/events/assist.entity';
import { AssistDTO } from "../../dto/events/assist/assist.dto";

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
  async saveAssist(assist: AssistDTO): Promise<void> {
    return this.assistRepo.save(assist);
  }

}