import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Match } from "src/db/entities/match.entity";
import { MatchDTO } from "src/dto/match/match.dto";
import { MatchService } from "./match.service";

@Controller('match')
export class MatchController {
    matchService: MatchService;

    constructor(matchService: MatchService) {
        this.matchService = matchService;
    }

    @Post('start')
    startMatch(@Body() match: MatchDTO) {
        return this.matchService.saveMatch(match);
    }

    @Get('/:id')
    getMatchesByTeamId(@Param('id') id: number ) : Promise<Match[]>{  
        return this.matchService.getMatches(id);
    }
    

}
