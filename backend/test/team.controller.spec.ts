import { Test, TestingModule } from '@nestjs/testing';
import { TeamDTO } from '../src/dto/team/team.dto';
import { TeamService } from '../src/team/team.service';
import { QueryFailedError, Repository } from 'typeorm';
import { TeamController } from '../src/team/team.controller';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTeamDTO } from '../src/dto/team/createTeam.dto';

const teamDto: CreateTeamDTO = {
  name: 'team',
};

describe('TeamController', () => {
  let controller: TeamController;
  let teamService: TeamService;
  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        TeamService,
        { provide: 'TeamRepository', useClass: Repository },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    teamService = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call team service to create a team', async () => {
    const createdTeam: TeamDTO = {
      teamId: 1,
      name: 'firstTeam',
    };
    const spy = jest
      .spyOn(teamService, 'saveTeam')
      .mockResolvedValue(createdTeam);
    await controller.createTeam(teamDto, userId);
    expect(spy).toBeCalledWith(teamDto, userId);
  });

  it('should call team service to get teams by user id', async () => {
    const teamDtos: TeamDTO[] = [
      {
        teamId: 1,
        name: 'firstTeam',
      },
      {
        teamId: 2,
        name: 'secondTeam',
      },
    ];
    const spy = jest
      .spyOn(teamService, 'getTeamsByUserId')
      .mockResolvedValue(teamDtos);
    const response = await controller.getTeamsByUserId(userId);
    expect(response).toEqual(teamDtos);
    expect(spy).toBeCalledWith(userId);
  });

  it('should return bad request if foreign key constraint is violated', async () => {
    const queryFailedErr: QueryFailedError = new QueryFailedError('', [], '');
    queryFailedErr.message = 'violates foreign key constraint';
    jest.spyOn(teamService, 'saveTeam').mockRejectedValue(queryFailedErr);
    const response = controller.createTeam(teamDto, userId);
    await expect(response).rejects.toThrow(BadRequestException);
  });

  it('should return bad request if not null constraint is violated', async () => {
    const queryFailedErr: QueryFailedError = new QueryFailedError('', [], '');
    queryFailedErr.message = 'violates not-null constraint';
    jest.spyOn(teamService, 'saveTeam').mockRejectedValue(queryFailedErr);
    const response = controller.createTeam(teamDto, userId);
    await expect(response).rejects.toThrow(BadRequestException);
  });

  it('should return bad request if unique constraint is violated', async () => {
    const queryFailedErr: QueryFailedError = new QueryFailedError('', [], '');
    queryFailedErr.message = 'violates unique constraint';
    jest.spyOn(teamService, 'saveTeam').mockRejectedValue(queryFailedErr);
    const response = controller.createTeam(teamDto, userId);
    await expect(response).rejects.toThrow(BadRequestException);
  });

  it('should return internal server err if any other err is thrown', async () => {
    const err: Error = new Error();
    jest.spyOn(teamService, 'saveTeam').mockRejectedValue(err);
    const response = controller.createTeam(teamDto, userId);
    await expect(response).rejects.toThrow(InternalServerErrorException);
  });
});
