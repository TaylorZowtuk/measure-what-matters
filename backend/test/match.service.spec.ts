import { MatchService } from "../src/match/match.service";
import { Repository } from "typeorm";
import { Match } from "../src/db/entities/match.entity";
import { MatchDTO } from "../src/dto/match/match.dto";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";


const matchDto: MatchDTO = {
    matchId:1,
    teamId:1,
    time:1,
    isHomeTeam: false

};

const match = new Match();

match.matchId = 1;
match.teamId = 1;
match.time = 1;
match.isHomeTeam = false;

const matchDtos: MatchDTO[] = [matchDto];
const matchEntities: Match[] = [match];

describe('MatchService Test', () => {

    let matchService: MatchService;
    let matchRepository: Repository<Match>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MatchService, {provide:'MatchRepository', useClass: Repository},
            ],
        }).compile();
        
        matchService = module.get<MatchService>(MatchService);
        matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
    });

    it('check if service defined', () =>{
        expect(matchService).toBeDefined();
    });

    it('should create a match and add to database', () => {
        const spy = jest.spyOn(matchRepository, 'save');
        matchService.saveMatch(matchDto);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should get matches with a specified team id', () => {
        jest.spyOn(matchRepository, 'find').mockResolvedValue(matchEntities);
        const matches = matchService.getMatches(match.teamId);
        expect(matches).resolves.toBe(matchDtos);
    });

});
