import { Test, TestingModule } from '@nestjs/testing';
import { Assist } from '../src/db/entities/events/assist.entity';
import { AssistController } from '../src/event/assist/assist.controller';
import { AssistService } from '../src/event/assist/assist.service';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateAssistDTO } from '../src/dto/events/assist/createAssist.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AssistController tests', () => {
  let assistController: AssistController;
  let assistService: AssistService;

  const assistDto: CreateAssistDTO = {
    matchId: 1,
    time: 100,
    playerId: 1,
  };

  const assist = new Assist();

  assist.matchId = 1;
  assist.time = 100;
  assist.playerId = 1;
  assist.id = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssistController],
      providers: [
        AssistService,
        { provide: 'AssistRepository', useClass: Repository },
      ],
    }).compile();

    assistController = module.get<AssistController>(AssistController);
    assistService = module.get<AssistService>(AssistService);
  });

  it('check if controller defined', () => {
    expect(assistController).toBeDefined();
  });

  describe('Saving assists with assist service', () => {
    const errorAssist: CreateAssistDTO = {
      matchId: -1,
      time: 100,
      playerId: -1,
    };
    it('calls assist service to create an assist', async () => {
      const spy = jest
        .spyOn(assistService, 'saveAssist')
        .mockResolvedValue(null);
      await assistController.saveAssistEvent(assistDto);
      expect(spy).toBeCalledWith(assistDto);
      expect(spy).toBeCalledTimes(1);
    });

    it('should throw a BadRequestException if foreign key constraint violated', async () => {
      const error = new QueryFailedError('', [], '');
      error.message = 'violates foreign key constraint';
      jest.spyOn(assistService, 'saveAssist').mockRejectedValueOnce(error);

      try {
        await assistController.saveAssistEvent(errorAssist);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('MatchId or PlayerId invalid');
      }
    });

    it('should throw a BadRequestException if not-null constraint violated', async () => {
      const error = new QueryFailedError('', [], '');
      error.message = 'violates not-null constraint';
      jest.spyOn(assistService, 'saveAssist').mockRejectedValueOnce(error);

      try {
        await assistController.saveAssistEvent(errorAssist);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('null value entered for parameter');
      }
    });

    it('should throw InternalServerException for any other error', async () => {
      const error = new Error();
      jest.spyOn(assistService, 'saveAssist').mockRejectedValueOnce(error);

      try {
        await assistController.saveAssistEvent(errorAssist);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Unknown error occurred');
      }
    });
  });

  describe('Getting assists with assist service', () => {
    const assistDtos = [assistDto, assistDto];
    it('Gets assists with assist service using playerId', async () => {
      const playerId = 1;
      const spy = jest
        .spyOn(assistService, 'getAssistByPlayerId')
        .mockResolvedValue(assistDtos);
      const result = await assistService.getAssistByPlayerId(playerId);
      expect(spy).toBeCalledWith(playerId);
      expect(spy).toBeCalledTimes(1);
      expect(result).toBe(assistDtos);
    });

    it('Gets assists with assist service using matchId', async () => {
      const matchId = 1;
      const spy = jest
        .spyOn(assistService, 'getAssistByMatchId')
        .mockResolvedValue(assistDtos);
      const result = await assistService.getAssistByMatchId(matchId);
      expect(spy).toBeCalledWith(matchId);
      expect(spy).toBeCalledTimes(1);
      expect(result).toBe(assistDtos);
    });

    it('Gets assists with assist service using playerId and matchId', async () => {
      const matchId = 1;
      const playerId = 1;
      const spy = jest
        .spyOn(assistService, 'getAssistByPlayerAndMatch')
        .mockResolvedValue(assistDtos);
      const result = await assistService.getAssistByPlayerAndMatch(
        playerId,
        matchId,
      );
      expect(spy).toBeCalledWith(playerId, matchId);
      expect(spy).toBeCalledTimes(1);
      expect(result).toBe(assistDtos);
    });

    it('should throw a BadRequestException if playerId and matchId both null', async () => {
      const spy = jest
        .spyOn(assistService, 'getAssistByPlayerAndMatch')
        .mockResolvedValue(null);
      const matchId = null;
      const playerId = null;
      try {
        await assistService.getAssistByPlayerAndMatch(playerId, matchId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Both playerId and matchId null');
      }
    });
  });
});
