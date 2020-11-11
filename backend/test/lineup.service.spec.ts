import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { LineupService } from '../src/lineup/lineup.service';
import { Lineup } from '../src/db/entities/lineup.entity';
import { CreateLineupDTO } from '../src/dto/lineup/createLineup.dto';

describe('LineupService Test', () => {
  let lineupService: LineupService;
  let lineupRepository: Repository<Lineup>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineupService,
        { provide: 'LineupRepository', useClass: Repository },
      ],
    }).compile();

    lineupService = module.get<LineupService>(LineupService);
    lineupRepository = module.get<Repository<Lineup>>(
      getRepositoryToken(Lineup),
    );
  });

  const createLineupDto: CreateLineupDTO = {
    matchId: 1,
    lineup: [1, 2, 3, 4, 5, 6],
  };

  const lineup = new Lineup();

  lineup.matchId = 1;
  lineup.lineup = [1, 2, 3, 4, 5, 6];

  it('check if service defined', () => {
    expect(lineupService).toBeDefined();
  });

  describe('Saving Lineup', () => {
    it('should call save 1 time', async () => {
      const spy = jest
        .spyOn(lineupRepository, 'save')
        .mockResolvedValue(lineup);
      await lineupService.saveLineup(createLineupDto);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('Getting Lineups', () => {
    it('lineupRepository find method should be called using matchId', async () => {
      const matchId = 1;
      const spy = jest
        .spyOn(lineupRepository, 'findOne')
        .mockResolvedValueOnce(lineup);

      await lineupService.getLineupByMatch(matchId);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({ where: { matchId } });
    });
  });
});
