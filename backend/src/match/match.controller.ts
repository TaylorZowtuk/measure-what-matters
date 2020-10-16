import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
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
    @ApiResponse({ status: 201, description: 'Creates a new match' })
    startMatch(@Body() match: MatchDTO) {
        return this.matchService.saveMatch(match);
    }

    @Get('/:teamId')
    @ApiResponse({
        status: 200,
        type: Match,
        isArray: true,
        description: 'Returns a list of matches for the given teamid',
      })
    getMatchesByTeamId(@Param('teamId') teamId: number ) : Promise<Match[]>{  
        return this.matchService.getMatches(teamId);
    }

    @Post('sub')
    saveSub(@Body() substitution: SubstitutionDTO){
        return this.subService.saveSub(substitution);
    }
    

}
