import { Test, TestingModule } from '@nestjs/testing';
import { QueryFailedError, Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LineupController } from '../src/lineup/lineup.controller';
import { CreateLineupDTO } from '../src/dto/lineup/createLineup.dto';
import { LineupService } from '../src/lineup/lineup.service';
import { LineupDTO } from '../src/dto/lineup/lineup.dto';

describe('LineupController tests', () => {
  let lineupController: LineupController;
  let lineupService: LineupService;

  const createLineupDto: CreateLineupDTO = {
    matchId: 1,
    lineup: [1, 2, 3, 4, 5, 6, 7],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineupController],
      providers: [
        LineupService,
        { provide: 'LineupRepository', useClass: Repository },
      ],
    }).compile();

    lineupController = module.get<LineupController>(LineupController);
    lineupService = module.get<LineupService>(LineupService);
  });

  it('check if controller defined', () => {
    expect(lineupController).toBeDefined();
  });

  describe('Saving lineups with lineup service', () => {
    // a lineup that generates an error, we will define errors in services later and make sure controller converts it correctly
    const errorLineup: CreateLineupDTO = {
      matchId: -1,
      lineup: [1, 2, 3, 4, 5, 6, 7],
    };
    it('calls lineup service to create a lineup', async () => {
      const spy = jest
        .spyOn(lineupService, 'saveLineup')
        .mockResolvedValue(null);
      await lineupController.createLineup(createLineupDto);
      expect(spy).toBeCalledWith(createLineupDto);
      expect(spy).toBeCalledTimes(1);
    });

    it('should throw a BadRequestException if foreign key constraint violated', async () => {
      const error = new QueryFailedError('', [], '');
      error.message = 'violates foreign key constraint';
      jest.spyOn(lineupService, 'saveLineup').mockRejectedValueOnce(error);

      try {
        await lineupController.createLineup(errorLineup);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('MatchId not in database');
      }
    });

    it('should throw a BadRequestException if not-null constraint violated', async () => {
      const error = new QueryFailedError('', [], '');
      error.message = 'violates not-null constraint';
      jest.spyOn(lineupService, 'saveLineup').mockRejectedValueOnce(error);

      try {
        await lineupController.createLineup(errorLineup);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('null value entered for parameter');
      }
    });

    it('should throw InternalServerException for any other error', async () => {
      const error = new Error();
      jest.spyOn(lineupService, 'saveLineup').mockRejectedValueOnce(error);

      try {
        await lineupController.createLineup(errorLineup);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Unknown error occurred');
      }
    });
  });

  describe('Getting lineups with lineup service', () => {
    const lineupDto: LineupDTO = {
      lineupId: 1,
      matchId: 1,
      lineup: [1, 2, 3, 4, 5, 6, 7],
    };
    it('Gets lineups using lineup service by matchId', async () => {
      const matchId = 1;
      const spy = jest
        .spyOn(lineupService, 'getLineupByMatch')
        .mockResolvedValue(lineupDto);
      const result = await lineupService.getLineupByMatch(matchId);
      expect(spy).toBeCalledWith(matchId);
      expect(spy).toBeCalledTimes(1);
      expect(result).toBe(lineupDto);
    });
  });
});
