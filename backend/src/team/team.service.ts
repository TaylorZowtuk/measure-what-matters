import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../db/entities/team.entity';
import { CreateTeamDTO } from '../dto/team/createTeam.dto';
import { TeamDTO } from '../dto/team/team.dto';

@Injectable()
export class TeamService {
  teamRepo: Repository<Team>;

  constructor(@InjectRepository(Team) teamRepo: Repository<Team>) {
    this.teamRepo = teamRepo;
  }

  /**
   * Creates a team in the database
   *
   * @param team - The team to create
   */
  async saveTeam(team: CreateTeamDTO, userId: number) {
    team.userId = userId;
    const createdTeam: Team = await this.teamRepo.save(team);
    return this.convertToDto([createdTeam])[0];
  }

  /**
   * Returns all teams associated with the given user id
   *
   * @param userId - The id of the user to return teams for
   *
   * @returns A list of team dtos in a promise
   */
  async getTeamsByUserId(userId: number): Promise<TeamDTO[]> {
    const teams: Team[] = await this.teamRepo.find({
      where: { userId: userId },
    });
    return this.convertToDto(teams);
  }

  /**
   * Converts a list of team entities into a list of team dtos
   *
   * @param teams - The list of team entities to convert to Dto list
   *
   * @returns A list of team dtos
   */
  private convertToDto(teams: Team[]) {
    const teamDtos: TeamDTO[] = [];
    teams.forEach(teamEntity => {
      const teamDto: TeamDTO = {
        teamId: teamEntity.teamId,
        name: teamEntity.name,
      };
      teamDtos.push(teamDto);
    });
    return teamDtos;
  }
}
