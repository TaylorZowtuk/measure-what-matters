import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Match } from '../db/entities/match.entity';
import { MatchDTO } from '../dto/match/match.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchService } from './match.service';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('match')
export class MatchController {
  matchService: MatchService;

  constructor(matchService: MatchService) {
    this.matchService = matchService;
  }

  @Post('start')
  @ApiResponse({ status: 201, description: 'Creates a new match' })
  async startMatch(@Body() match: MatchDTO) {
    return await this.matchService.saveMatch(match);
  }

  @Get('/teamId')
  @ApiResponse({
    status: 200,
    type: Match,
    isArray: true,
    description: 'Returns a list of matches for the given teamId',
  })
  async getMatchesByTeamId(
    @Query('teamId') teamId: number,
  ): Promise<MatchDTO[]> {
    return await this.matchService.getMatches(teamId);
  }
}
