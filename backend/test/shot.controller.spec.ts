import { Test, TestingModule } from '@nestjs/testing';
import { QueryFailedError, Repository } from 'typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ShotController } from '../src/event/shot/shot.controller';
import { ShotService } from '../src/event/shot/shot.service';
import { CreateShotDTO } from '../src/dto/events/shot/createShot.dto';
import { ShotDTO } from '../src/dto/events/shot/shot.dto';

describe('ShotController tests', () => {
  let shotController: ShotController;
  let shotService: ShotService;

  const createShotDto: CreateShotDTO = {
    matchId: 1,
    time: 100,
    playerId: 1,
    onTarget: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShotController],
      providers: [
        ShotService,
        { provide: 'ShotRepository', useClass: Repository },
      ],
    }).compile();

    shotController = module.get<ShotController>(ShotController);
    shotService = module.get<ShotService>(ShotService);
  });

  it('check if controller defined', () => {
    expect(shotController).toBeDefined();
  });

  describe('Saving shots with shot service', () => {
    // a shot that generates an error, we will define errors in services later and make sure controller converts it correctly
    const errorShotDto: CreateShotDTO = {
      matchId: -1,
      time: 100,
      playerId: -1,
      onTarget: true,
    };
    it('calls shot service to create a shot event', async () => {
      const spy = jest.spyOn(shotService, 'saveShot').mockResolvedValue(null);
      await shotController.saveShotEvent(createShotDto);
      expect(spy).toBeCalledWith(createShotDto);
      expect(spy).toBeCalledTimes(1);
    });

    it('should throw a BadRequestException if foreign key constraint violated', async () => {
      const error = new QueryFailedError('', [], '');
      error.message = 'violates foreign key constraint';
      jest.spyOn(shotService, 'saveShot').mockRejectedValueOnce(error);

      try {
        await shotController.saveShotEvent(errorShotDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('MatchId or PlayerId invalid');
      }
    });

    it('should throw InternalServerException for any other error', async () => {
      const error = new Error();
      jest.spyOn(shotService, 'saveShot').mockRejectedValueOnce(error);

      try {
        await shotController.saveShotEvent(errorShotDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toBe('Unknown error occurred');
      }
    });
  });

  describe('Getting shots with shot service', () => {
    const shotDto: ShotDTO = {
      id: 1,
      matchId: 1,
      time: 100,
      playerId: 1,
      onTarget: true,
    };
    const shotDtos: ShotDTO[] = [shotDto, shotDto];
    it('Gets shots using shot service by MatchId', async () => {
      const matchId = 1;
      const spy = jest
        .spyOn(shotService, 'getShotsByMatchId')
        .mockResolvedValue(shotDtos);
      const result = await shotService.getShotsByMatchId(matchId);
      expect(spy).toBeCalledWith(matchId);
      expect(spy).toBeCalledTimes(1);
      expect(result).toBe(shotDtos);
    });
  });
});
