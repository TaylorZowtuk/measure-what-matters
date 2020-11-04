import { Test, TestingModule } from '@nestjs/testing';
import { Team } from '../src/db/entities/team.entity';
import { TeamDTO } from '../src/dto/team/team.dto';
import { TeamService } from '../src/team/team.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTeamDTO } from '../src/dto/team/createTeam.dto';

describe('TeamService', () => {
  let service: TeamService;
  let teamRepository: Repository<Team>;

  const userId = 1;
  const teamId = 1;
  const teamName = 'teamName';

  const team = new Team();
  team.name = teamName;
  team.teamId = teamId;
  team.userId = userId;

  const teamDto: TeamDTO = {
    teamId: teamId,
    name: teamName,
  };

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
    const createTeamDto: CreateTeamDTO = {
      name: teamName,
      userId: userId,
    };
    const spy = jest
      .spyOn(teamRepository, 'save')
      .mockResolvedValue(teamEntities[0]);
    const res = await service.saveTeam(createTeamDto, userId);
    expect(spy).toBeCalledWith(createTeamDto);
    expect(res).toEqual(teamDto);
  });

  it('should get teams with specified user id', async () => {
    jest.spyOn(teamRepository, 'find').mockResolvedValue(teamEntities);
    const teams = await service.getTeamsByUserId(userId);
    expect(teams).toEqual([teamDto]);
  });
});
