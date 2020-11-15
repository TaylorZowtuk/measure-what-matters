import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shot } from '../src/db/entities/events/shot.entity';
import { CreateShotDTO } from '../src/dto/events/shot/createShot.dto';
import { ShotService } from '../src/event/shot/shot.service';
import { Repository } from 'typeorm';

describe('ShotService Test', () => {
  let shotService: ShotService;
  let shotRepository: Repository<Shot>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShotService,
        { provide: 'ShotRepository', useClass: Repository },
      ],
    }).compile();

    shotService = module.get<ShotService>(ShotService);
    shotRepository = module.get<Repository<Shot>>(getRepositoryToken(Shot));
  });

  const createShotDto: CreateShotDTO = {
    matchId: 1,
    time: 100,
    playerId: 1,
    onTarget: true,
  };

  const shot: Shot = new Shot();
  shot.matchId = 1;
  shot.time = 100;
  shot.playerId = 1;
  shot.onTarget = true;
  shot.id = 1;

  it('check if service defined', () => {
    expect(shotService).toBeDefined();
  });

  describe('Saving Shot', () => {
    it('should call save 1 time', async () => {
      const spy = jest.spyOn(shotRepository, 'save').mockResolvedValue(shot);
      await shotService.saveShot(createShotDto);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(createShotDto);
    });
  });

  describe('Getting Shots', () => {
    const shots = [shot, shot];
    it('shotRepository find method should be called using matchId', async () => {
      const matchId = 1;
      const spy = jest
        .spyOn(shotRepository, 'find')
        .mockResolvedValueOnce(shots);

      await shotService.getShotsByMatchId(matchId);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ where: { matchId } });
    });
  });
});
