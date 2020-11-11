import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AssistService } from '../src/event/assist/assist.service';
import { Assist } from '../src/db/entities/events/assist.entity';
import { CreateAssistDTO } from '../src/dto/events/assist/createAssist.dto';

describe('AssistService Test', () => {
  let assistService: AssistService;
  let assistRepository: Repository<Assist>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistService,
        { provide: 'AssistRepository', useClass: Repository },
      ],
    }).compile();

    assistService = module.get<AssistService>(AssistService);
    assistRepository = module.get<Repository<Assist>>(
      getRepositoryToken(Assist),
    );
  });

  const createAssistDto: CreateAssistDTO = {
    matchId: 1,
    time: 10,
    playerId: 1,
  };

  const assist = new Assist();

  assist.matchId = 1;
  assist.time = 10;
  assist.playerId = 1;

  const assistEntities = [assist, assist];
  const assistDtos = [createAssistDto, createAssistDto];

  it('check if service defined', () => {
    expect(assistService).toBeDefined();
  });

  describe('Saving Assist', () => {
    it('should call save 1 time', async () => {
      const spy = jest
        .spyOn(assistRepository, 'save')
        .mockResolvedValue(assist);
      await assistService.saveAssist(createAssistDto);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('Getting Assists', () => {
    it('assistRepository find method should be called using playerId', async () => {
      const playerId = 1;
      const spy = jest
        .spyOn(assistRepository, 'find')
        .mockResolvedValueOnce(assistEntities);

      await assistService.getAssistByPlayerId(playerId);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ where: { playerId } });
    });

    it('assistRepository find method should be called using matchId', async () => {
      const matchId = 1;
      const spy = jest
        .spyOn(assistRepository, 'find')
        .mockResolvedValueOnce(assistEntities);

      await assistService.getAssistByMatchId(matchId);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ where: { matchId } });
    });

    it('assistRepository find method should be called using matchId and playerId', async () => {
      const matchId = 1;
      const playerId = 1;
      const spy = jest
        .spyOn(assistRepository, 'find')
        .mockResolvedValueOnce(assistEntities);

      await assistService.getAssistByPlayerAndMatch(playerId, matchId);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ where: { matchId, playerId } });
    });
  });
});
