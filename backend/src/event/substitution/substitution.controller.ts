import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { SubstitutionExchangeDTO } from '../../dto/events/substitution/substitution-exchange.dto';
import { SubstitutionDTO } from '../../dto/events/substitution/substitution.dto';
import { SubstitutionService } from './substitution.service';

@ApiTags('Substitutions')
@Controller('event/substitutions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SubstitutionController {
  substitutionService: SubstitutionService;

  constructor(substitutionService: SubstitutionService) {
    this.substitutionService = substitutionService;
  }

  @Post('/')
  @ApiResponse({
    status: 201,
    description: 'Creates a substitution event',
  })
  @ApiResponse({
    status: 400,
    description: 'The request body contains an invalid field',
  })
  @ApiResponse({
    status: 500,
    description: 'Something went wrong',
  })
  async saveSubstitutionEvent(
    @Body() substitutionExchangeDto: SubstitutionExchangeDTO,
  ) {
    try {
      await this.substitutionService.saveSubstitution(substitutionExchangeDto);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.message.includes('violates not-null constraint')) {
          throw new BadRequestException(
            'The request body contains a missing or null field',
          );
        }
        if (err.message.includes('violates foreign key constraint')) {
          throw new BadRequestException('The matchId or playerId is invalid.');
        }
      }
      throw new InternalServerErrorException(
        'Something went wrong. Please try again later.',
      );
    }
  }

  @Post('startingLineup')
  @ApiResponse({
    status: 201,
    description: 'Creates the starting lineup substitutions',
  })
  @ApiResponse({
    status: 400,
    description: 'The request body contains an invalid field',
  })
  @ApiResponse({
    status: 500,
    description: 'Something went wrong',
  })
  @ApiBody({
    type: SubstitutionDTO,
    isArray: true,
  })
  async createStartingSubs(@Body() substitutionDtos: SubstitutionDTO[]) {
    try {
      await this.substitutionService.createStartingSubs(substitutionDtos);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.message.includes('violates not-null constraint')) {
          throw new BadRequestException(
            'The request body contains a missing or null field',
          );
        }
        if (err.message.includes('violates foreign key constraint')) {
          throw new BadRequestException('The matchId or playerId is invalid.');
        }
      }
      throw new InternalServerErrorException(
        'Something went wrong. Please try again later.',
      );
    }
  }
}
