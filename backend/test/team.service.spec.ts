import { Test, TestingModule } from '@nestjs/testing';
import { Team } from '../src/db/entities/team.entity';
import { TeamDTO } from '../src/dto/team.dto';
import { TeamService } from '../src/team/team.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

const team = new Team();
team.name = 'teamName';
team.teamId = 1;
team.userId = 1;

const teamEntities: Team[] = [team];

const teamDto: TeamDTO = {
  teamId: 1,
  name: 'teamName',
  userId: 1,
};

const teamDtos: TeamDTO[] = [teamDto];

describe('TeamService', () => {
  let service: TeamService;
  let teamRepository: Repository<Team>;

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
    const spy = jest
      .spyOn(teamRepository, 'save')
      .mockResolvedValueOnce(teamEntities[0]);
    await service.saveTeam(teamDto);
    expect(spy).toBeCalledWith(teamDto);
  });

  it('should add team to db', async () => {
    const spy = jest
      .spyOn(teamRepository, 'save')
      .mockResolvedValueOnce(teamEntities[0]);
    await service.saveTeam(teamDto);
    expect(spy).toBeCalledWith(teamDto);
  });

  it('should get teams with specified user id', () => {
    jest.spyOn(teamRepository, 'find').mockResolvedValue(teamEntities);
    const teams = service.getTeamsByUserId(team.userId);
    expect(teams).resolves.toBe(teamDtos);
  });

  it('should get the team with the specified name', () => {
    jest.spyOn(teamRepository, 'find').mockResolvedValue(teamEntities);
    const teams = service.getTeamByName(team.name);
    expect(teams).resolves.toBe(teamDto);
  });
});
