import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Match } from "src/db/entities/match.entity";
import { SubstitutionDTO } from "src/dto/events/substitution.dto";
import { MatchDTO } from "src/dto/match/match.dto";
import { MatchService } from "./match.service";
import { SubstitutionService } from "./substitution.service";

@Controller('match')
export class MatchController {
    matchService: MatchService;
    subService: SubstitutionService;

    constructor(matchService: MatchService, subService : SubstitutionService) {
        this.matchService = matchService;
        this.subService = subService;
    }

    @Post('start')
    startMatch(@Body() match: MatchDTO) {
        return this.matchService.saveMatch(match);
    }

    @Get('/:id')
    getMatchesByTeamId(@Param('id') id: number ) : Promise<Match[]>{  
        return this.matchService.getMatches(id);
    }

    @Post('sub')
    saveSub(@Body() substitution: SubstitutionDTO){
        return this.subService.saveSub(substitution);
    }
    

}
