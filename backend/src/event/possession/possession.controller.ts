import { Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Possessions')
@Controller('event/possession')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PossessionController {
  @ApiResponse({
    status: 201,
    description: 'Creates a player possession event.',
  })
  @Post('/player')
  async playerPossession() {
    // Pass
  }

  @ApiResponse({
    status: 201,
    description: 'Creates a opposition possession event.',
  })
  @Post('/opposition')
  async oppositionPossession() {
    // Pass
  }

  // TODO, ask if we are computing these stats on the frontend or using an aggregator in the stats endpoint
  // @ApiResponse({
  //   status: 200,
  //   description: 'Returns an ',
  // })
  // @Get('/')
  // async getAllPossessionEvents() {
  //   // PASS
  // }

  @Delete('/')
  async removePossessionEvent() {
    // Pass
  }
}
