import { Body, Controller, Post, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerArrayDTO } from '../dto/player/playerArray.dto';
import { PlayerDTO } from '../dto/player/player.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayerService } from './player.service';

@ApiTags('Players')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Creates a new player' })
  async createPlayers(@Body() players: PlayerArrayDTO) {
    return await this.playerService.savePlayer(players);
  }

  @Get('/teamId')
  @ApiResponse({
    status: 200,
    type: PlayerArrayDTO,
    isArray: true,
    description: 'Returns array of players for the given team Id',
  })
  async getPlayersByTeamId(
    @Query('teamId') teamId: number,
  ): Promise<PlayerDTO[]> {
    return await this.playerService.getPlayersByTeamId(teamId);
  }
}
