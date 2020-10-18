import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SubstitutionExchangeDTO } from '../../dto/events/substitution/substitution-exchange.dto';
import { SubstitutionDTO } from '../../dto/events/substitution/substitution.dto';
import { SubstitutionService } from './substitution.service';

@ApiTags('Substitutions')
@Controller('event/substitutions')
export class SubstitutionController {
    substitutionService: SubstitutionService;
    
    constructor(substitutionService: SubstitutionService) {
        this.substitutionService = substitutionService;
    }

    @Post('/')
    @ApiResponse({
        status: 201,
        description: 'Creates the starting lineup substitutions'
    })
    async saveSubstitutionEvent(@Body() substitutionExchangeDto: SubstitutionExchangeDTO) {
        return await this.substitutionService.saveSubstitution(substitutionExchangeDto);
    }

    @Post('startingLineup')
    @ApiResponse({
        status: 201,
        description: 'Creates the starting lineup substitutions'
    })
    @ApiBody({
        type: SubstitutionDTO,
        isArray: true
    })
    async createStartingSubs(@Body() substitutionDtos: SubstitutionDTO[]) {
        return await this.substitutionService.createStartingSubs(substitutionDtos);
    }    
}
