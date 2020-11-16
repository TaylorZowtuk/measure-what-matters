import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MatchDTO } from 'src/dto/match/match.dto';
import { Repository } from 'typeorm';
import { Match } from '../src/db/entities/match.entity';
import { CreateMatchDTO } from '../src/dto/match/createMatch.dto';
import { MatchController } from '../src/match/match.controller';
import { MatchService } from '../src/match/match.service';

describe('MatchController', () => {
  let matchController: MatchController;
  let matchService: MatchService;

  // const createMatchDto: CreateMatchDTO = {
  //   teamId: 1,
  //   startTime: 0,
  //   isHomeTeam: true,
  // };

  // const returnMatchDto: MatchDTO = {
  //   matchId: 1,
  //   teamId: 1,
  //   startTime: 0,
  //   isHomeTeam: true,
  //   halfTime: 600,
  //   fullTime: 1200,
  // };

  // const match = new Match();

  // match.teamId = 1;
  // match.startTime = 100;
  // match.isHomeTeam = true;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        MatchService,
        { provide: 'MatchRepository', useClass: Repository },
      ],
    }).compile();

    matchController = module.get<MatchController>(MatchController);
    matchService = module.get<MatchService>(MatchService);
  });

  it('check if controller defined', () => {
    expect(matchController).toBeDefined();
    expect(matchService).toBeDefined();
  });

  // describe('Saving match with match service', () => {
  //   it('calls match service to create a match', async () => {
  //     const spy = jest.spyOn(matchService, 'saveMatch').mockResolvedValue(null);
  //     await matchService.saveMatch(createMatchDto);
  //     expect(spy).toBeCalledWith(createMatchDto);
  //     expect(spy).toBeCalledTimes(1);
  //   });
  // });

  // describe('Getting matches with match service', () => {
  //   const matchDtos = [returnMatchDto, returnMatchDto];
  //   it('Gets matches with match service using teamId', async () => {
  //     const teamId = 1;
  //     const spy = jest
  //       .spyOn(matchService, 'getMatches')
  //       .mockResolvedValue(matchDtos);
  //     const result = await matchService.getMatches(teamId);
  //     expect(spy).toBeCalledWith(teamId);
  //     expect(spy).toBeCalledTimes(1);
  //     expect(result).toBe(matchDtos);
  //   });

  //   it('should throw a BadRequestException if the teamId does not exist when searching for matches', async () => {
  //     jest.spyOn(matchService, 'getMatches').mockResolvedValue(null);
  //     const teamId = -1;
  //     try {
  //       await matchService.getMatches(teamId);
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(BadRequestException);
  //       expect(error.message).toBe('MatchId or PlayerId invalid');
  //     }
  //   });
  // });
});
