import { Test, TestingModule } from '@nestjs/testing';
import { TeamDTO } from '../src/dto/team.dto';
import { TeamService } from '../src/team/team.service';
import { Repository } from 'typeorm';
import { TeamController } from '../src/team/team.controller';

const teamDto: TeamDTO = {
  teamId: 1,
  name: 'team',
  userId: 1
}

const teamDtos: TeamDTO[] = [
  teamDto,
  {
    teamId: 2,
    name: 'secondTeam',
    userId: 1
  }
]

describe('TeamController', () => {
  let controller: TeamController;
  let teamService: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        TeamService,
        { provide: 'TeamRepository', useClass: Repository }
      ]
    }).compile();

    controller = module.get<TeamController>(TeamController);
    teamService = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call team service to create a team', () => {
    const team: TeamDTO = new TeamDTO();
    const spy = jest.spyOn(teamService, 'saveTeam').mockImplementation(() => {
      return new Promise<void>(() => {
        return;
      });
    });
    controller.createTeam(team);
    expect(spy).toBeCalledTimes(1);
  });

  it('should call team service to get teams by user id', () => {
    const userId = 1;
    jest.spyOn(teamService, 'getTeamsByUserId').mockResolvedValue(teamDtos);
    const response = controller.getTeamsByUserId(userId);
    expect(response).resolves.toBe(teamDtos);
  });

  it('should call team service to get team by name', () => {
    const name = 'team';
    jest.spyOn(teamService, 'getTeamByName').mockResolvedValue(teamDto);
    const response = controller.getTeamByName(name);
    expect(response).resolves.toBe(teamDto);
  });

});
