import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Possessions')
@Controller('event/possession')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PossessionController {}
