import { Test, TestingModule } from '@nestjs/testing';
import { Team } from '../src/db/entities/team.entity';
import { TeamDTO } from '../src/dto/team/team.dto';
import { TeamService } from '../src/team/team.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepository: Repository<Team>;

  const userId = 1;

  const team = new Team();
  team.name = 'teamName';
  team.teamId = 1;
  team.userId = userId;

  const teamEntities: Team[] = [team];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        { provide: 'TeamRepository', useClass: Repository },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add team to db', async () => {
    const teamDto: TeamDTO = {
      name: 'teamName',
      userId: userId,
    };
    const spy = jest
      .spyOn(teamRepository, 'save')
      .mockResolvedValue(teamEntities[0]);
    await service.saveTeam(teamDto, userId);
    expect(spy).toBeCalledWith(teamDto);
  });

  it('should get teams with specified user id', async () => {
    const teamDto: TeamDTO = {
      name: 'teamName',
    };
    jest.spyOn(teamRepository, 'find').mockResolvedValue(teamEntities);
    const teams = await service.getTeamsByUserId(userId);
    expect(teams).toEqual([teamDto]);
  });
});
