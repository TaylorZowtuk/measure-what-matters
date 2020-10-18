import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Match } from "src/db/entities/match.entity";
import { MatchDTO } from "src/dto/match/match.dto";
import { MatchService } from "./match.service";

@ApiTags('Matches')
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
        description: 'Returns a list of matches for the given teamid',
      })
    async getMatchesByTeamId(@Query('teamId') teamId: number) : Promise<MatchDTO[]>{  
        return await this.matchService.getMatches(teamId);
    }

}
