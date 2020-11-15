import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Headers,
  Post,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTeamDTO } from '../dto/team/createTeam.dto';
import { TeamDTO } from '../dto/team/team.dto';
import { RequestUser } from '../types/requestUser.type';
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
  @ApiResponse({
    status: 201,
    type: TeamDTO,
    description: 'Returns the team that was created',
  })
  @ApiResponse({
    status: 400,
    description: 'Request contains invalid data or team name is already taken.',
  })
  @ApiResponse({
    status: 500,
    description: 'Something went wrong.',
  })
  async createTeam(
    @Body() team: CreateTeamDTO,
    @Request() { user }: RequestUser,
  ) {
    try {
      return await this.teamService.saveTeam(team, user.userId);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.message.includes('violates foreign key constraint')) {
          throw new BadRequestException(
            'The request body contains an invalid userId',
          );
        } else if (err.message.includes('violates not-null constraint')) {
          throw new BadRequestException(
            'The request body contains a missing or null value',
          );
        } else if (err.message.includes('violates unique constraint')) {
          throw new BadRequestException('The team name is already taken');
        }
      }
      throw new InternalServerErrorException(
        'Something went wrong. Please try again later.',
      );
    }
  }

  @Get('/')
  @ApiResponse({
    status: 200,
    type: TeamDTO,
    isArray: true,
    description: 'Gets all teams for the user',
  })
  async getTeamsByUserId(@Headers('userId') userId: number) {
    return await this.teamService.getTeamsByUserId(userId);
  }

  @Post('/edit')
  @ApiResponse({
    status: 200,
    description: 'Update team name',
  })
  @ApiResponse({
    status: 400,
    description: 'Problems with request input',
  })
  @ApiResponse({
    status: 404,
    description: 'Team does not exist in database',
  })
  async upDateTeamName(@Body() updateTeam: TeamDTO) {
    try {
      return await this.teamService.updateTeamName(updateTeam);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new NotFoundException(
          'Team with teamId does not exist in database',
        );
      } else if (error.message.includes('violates unique constraint')) {
        throw new BadRequestException('The team name is already taken');
      } else {
        throw new InternalServerErrorException('Unknown error occured');
      }
    }
  }
}
