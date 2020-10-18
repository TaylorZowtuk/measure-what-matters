import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Team } from "../db/entities/team.entity";
import { TeamDTO } from "../dto/team.dto";


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
    async saveTeam(team: TeamDTO) {
        this.teamRepo.save(team);
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
            where: { userId: userId}
        });
        return this.convertToDto(teams);
    }

    /**
     * Retreives the team with the given name
     * 
     * @param name - The name of the team to retrieve
     * 
     * @returns A team dto in a promise
     */
    async getTeamByName(name: string): Promise<TeamDTO> {
        const teams: Team[] = await this.teamRepo.find({
            where: { name: name}
        });
        return this.convertToDto(teams)[0];
    }


    /**
     * Converts a list of team entities into a list of team dtos
     * 
     * @param teams - The list of team entities to convert to Dto list
     * 
     * @returns A list of team dtos
     */
    private convertToDto(teams: any[]) {
        const teamDtos: TeamDTO[] = [];
        teams.forEach(teamEntity => {
            const teamDto: TeamDTO = {
                teamId: teamEntity.teamId,
                name: teamEntity.name,
                userId: teamEntity.userId.userId,
            }
            teamDtos.push(teamDto);
        });
        return teamDtos;
    }
}
