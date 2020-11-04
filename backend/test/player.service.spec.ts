import { PlayerService } from '../src/player/player.service';
import { Repository } from 'typeorm';
import { Player } from '../src/db/entities/player.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePlayerDTO } from 'src/dto/player/createPlayer.dto';

describe('PlayerService Test', () => {
    let playerService: PlayerService;
    let playerRepository: Repository<Player>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          PlayerService,
          { provide: 'PlayerRepository', useClass: Repository },
        ],
      }).compile();
  
      playerService = module.get<PlayerService>(PlayerService);
      playerRepository = module.get<Repository<Player>>(
        getRepositoryToken(Player),
      );
    });

    const createPlayerDto: CreatePlayerDTO = {
        teamId:1,
        firstName: 'firstName',
        lastName: 'lastName',
        jerseyNum: 1,
    }
    
    const player = new Player();

    player.playerId = 1;
    player.teamId = 1;
    player.firstName = 'firstName';
    player.lastName = 'lastName';
    player.jerseyNum = 1;

    const playerDtos: CreatePlayerDTO[] = [createPlayerDto, createPlayerDto];
    const playerEntities: Player[] = [player,player];
  
    it('check if service defined', () => {
      expect(playerService).toBeDefined();
    });

    describe('Saving Players', () => {

     it('should call save n times', async () => {
            const spy = jest.spyOn(playerRepository,'save').mockResolvedValue(player);
            await playerService.savePlayer(playerDtos);
            expect(spy).toBeCalledTimes(playerEntities.length);
        });
    });

    describe('Getting Players', () => {

        it('playerRepository find method should be called using teamId', async() =>{
            const teamId = 1;
            const spy = jest.spyOn(playerRepository, 'find').mockResolvedValueOnce(playerEntities);

            await playerService.getPlayersByTeamId(teamId);

            expect(spy).toBeCalledTimes(1);
            expect(spy).toBeCalledWith({where:{teamId}});
        }); 



    });


});