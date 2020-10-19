import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TeamDTO } from '../dto/team.dto';
import { TeamService } from './team.service';

@Controller('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Teams')
export class TeamController {
  teamService: TeamService;

  constructor(teamService: TeamService) {
    this.teamService = teamService;
  }

  @Post('/')
  async createTeam(@Body() team: TeamDTO) {
    this.teamService.saveTeam(team);
  }

  @Get('/userId')
  @ApiResponse({
    status: 200,
    type: TeamDTO,
    isArray: true,
    description: 'Gets all teams for the given user',
  })
  async getTeamsByUserId(@Query('userId') userId: number) {
    return this.teamService.getTeamsByUserId(userId);
  }

  @Get('/name')
  @ApiResponse({
    status: 200,
    type: TeamDTO,
    description: 'Gets the team with the given name',
  })
  async getTeamByName(@Query('name') name: string) {
    return this.teamService.getTeamByName(name);
  }
}
