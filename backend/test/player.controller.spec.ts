import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing';
import { CreatePlayerDTO } from 'src/dto/player/createPlayer.dto';
import { PlayerController } from '../src/player/player.controller';
import { PlayerService } from '../src/player/player.service';
import { Repository } from 'typeorm';

describe('PlayerController', () => {
  let playerController: PlayerController;
  let playerService: PlayerService;

  const createPlayerDto1: CreatePlayerDTO = {
    teamId: 1,
    firstName: 'Jesus',
    lastName: 'Shuttlesworth',
    jerseyNum: 1,
  };

  const createPlayerDto2: CreatePlayerDTO = {
    teamId: 1,
    firstName: 'Cristiano',
    lastName: 'Ronaldo',
    jerseyNum: 2,
  };

  const createPlayersArray: CreatePlayerDTO[] = [
    createPlayerDto1,
    createPlayerDto2,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        { provide: 'PlayerRepository', useClass: Repository },
      ],
    }).compile();

    playerController = module.get<PlayerController>(PlayerController);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('check if controller defined', () => {
    expect(playerController).toBeDefined();
  });

  describe('Saving players using player service', () => {
    // create player that throws an error
    // checking that errors returned by controller match
    // error types thrown by service
    it('Calls player service to create a player', async () => {
      const spy = jest
        .spyOn(playerService, 'savePlayer')
        .mockResolvedValue(null);

      await playerController.createPlayers(createPlayersArray);
      expect(spy).toBeCalledWith(createPlayersArray);
      expect(spy).toBeCalledTimes(1);
    });
  });
});
