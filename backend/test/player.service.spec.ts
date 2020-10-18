import { PlayerService } from "../src/player/player.service";
import { Repository } from "typeorm";
import { Player } from "../src/db/entities/player.entity";
import { PlayerDTO } from "../src/dto/player/player.dto";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";


const playerDto: PlayerDTO = {
    playerId: 1,
    teamId: 1,
    name: 'name',
    jerseyNum: 1
};


const player = new Player();

player.playerId = 1;
player.teamId = 1;
player.name = 'name';
player.jerseyNum = 1;

const playerDtos: PlayerDTO[] = [playerDto];
const playerEntities: Player[] = [player];

describe('PlayerService Test', () => {

    let playerService: PlayerService;
    let playerRepository: Repository<Player>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PlayerService, {provide:'PlayerRepository', useClass: Repository},
            ],
        }).compile();
        
        playerService = module.get<PlayerService>(PlayerService);
        playerRepository = module.get<Repository<Player>>(getRepositoryToken(Player));
    });

    it('check if service defined', () =>{
        expect(playerService).toBeDefined();
    });

    it('should create a player and add to database', () => {
        const spy = jest.spyOn(playerRepository, 'save');
        playerService.savePlayer(playerDto);
        expect(spy).toHaveBeenCalledTimes(1);
    });
    
    it('should get players with a specified team id', () => {
        jest.spyOn(playerRepository, 'find').mockResolvedValue(playerEntities);
        const players = playerService.getPlayers(player.teamId);
        expect(players).resolves.toBe(playerDtos);
    });

});
