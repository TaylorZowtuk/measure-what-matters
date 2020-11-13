import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayerDTO } from '../dto/player/player.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayerService } from './player.service';
import { QueryFailedError } from 'typeorm';
import { CreatePlayerDTO } from '../dto/player/createPlayer.dto';
import { ApiBody } from '@nestjs/swagger';
import { UpdatePlayerDTO } from 'src/dto/player/updatePlayer.dto';

@ApiTags('Players')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Creates a new player' })
  @ApiResponse({
    status: 400,
    description: 'TeamId not in database or null value entered for parameter',
  })
  @ApiResponse({ status: 500, description: 'Unknown error occured' })
  @ApiBody({
    type: CreatePlayerDTO,
    isArray: true,
  })
  @UsePipes(ValidationPipe)
  async createPlayers(@Body() players: CreatePlayerDTO[]) {
    try {
      return await this.playerService.savePlayer(players);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('violates foreign key constraint')) {
          return new BadRequestException('TeamId not in database');
        }
      } else if (error.message.includes('violates not-null constraint')) {
        return new BadRequestException('null value entered for parameter');
      } else {
        return new InternalServerErrorException('Unknown error');
      }
    }
  }

  @Get('/teamId')
  @ApiResponse({
    status: 200,
    type: PlayerDTO,
    isArray: true,
    description: 'Returns array of players for the given team Id',
  })
  @ApiResponse({ status: 400, description: 'Invalid integer entered' })
  @ApiResponse({ status: 500, description: 'Unknown error occured' })
  async getPlayersByTeamId(
    @Query('teamId', ParseIntPipe) teamId: number,
  ): Promise<PlayerDTO[]> {
    try {
      return await this.playerService.getPlayersByTeamId(teamId);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('invalid input syntax for type integer')) {
          throw new BadRequestException('Please enter a valid integer');
        }
      } else {
        throw new InternalServerErrorException('Unknown problem occured');
      }
    }
  }
  @Delete('/delete')
  @ApiResponse({
    status: 200,
    description: 'Player entity removed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Not a number, number expected',
  })
  @ApiResponse({
    status: 404,
    description: 'Player does not exist in database',
  })
  @ApiResponse({
    status: 500,
    description: 'Unknown error occured',
  })
  async delete(
    @Query('playerId', ParseIntPipe) playerId: number,
  ): Promise<void> {
    try {
      return await this.playerService.removePlayerById(playerId);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw error;
      } else {
        throw new InternalServerErrorException('Unknown error occured');
      }
    }
  }

  @Post('/edit')
  @ApiResponse({
    status: 200,
    description: 'Update player entity',
  })
  @ApiResponse({
    status: 400,
    description: 'Problems with request input',
  })
  @ApiResponse({
    status: 404,
    description: 'Player does not exist in database',
  })
  @UsePipes(ValidationPipe)
  async updatePlayer(@Body() updatePlayer: UpdatePlayerDTO) {
    try {
      return await this.playerService.updatePlayer(updatePlayer);
    } catch (error) {
      if (error.message.includes('Could not find any entity')) {
        throw new NotFoundException(
          'Player with playerId does not exist in database',
        );
      } else {
        throw new InternalServerErrorException('Unknown error occured');
      }
    }
  }
}
