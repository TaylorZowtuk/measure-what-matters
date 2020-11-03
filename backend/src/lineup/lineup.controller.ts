import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { QueryFailedError } from "typeorm";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateLineupDTO } from "../dto/lineup/createLineup.dto";
import { LineupDTO } from "../dto/lineup/lineup.dto";
import { LineupService } from "./lineup.service";

@ApiTags('Lineups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lineups')

export class LineupController {
    constructor(private readonly lineupService: LineupService) {}

    @Post('')
    @ApiResponse({ status: 201, description: 'Creates a new player' })
    async createLineup(@Body() lineup: CreateLineupDTO) {
        try{
            return await this.lineupService.saveLineup(lineup);
        }
        catch(error){
            if (error instanceof QueryFailedError){
              if(error.message.includes("violates foreign key constraint")){
                throw new BadRequestException("MatchId not in database");
              }
            }
            else if(error.message.includes("violates not-null constraint")){
              throw new BadRequestException("null value entered for parameter");
            }
            else{
              throw new InternalServerErrorException("Unknown error");
            }
        }
    }

    @Get('')
    @ApiResponse({
        status: 200,
        type: LineupDTO,
        description: 'Returns lineup for given matchId',
    })
    async getLineupByMatch(@Query('matchId') matchId: number){
        try{
            throw await this.lineupService.getLineupByMatch(matchId);
        }
        catch(error){
            if(error instanceof TypeError){
                if(error.message.includes("Cannot read property")){
                    throw new BadRequestException("MatchId does not have assosciated lineup");
                }
            }
            else{
                throw new InternalServerErrorException("Unknown problem occured");
            }
        }
    }

}