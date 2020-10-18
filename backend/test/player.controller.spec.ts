import { TestingModule, Test } from '@nestjs/testing';
import { PlayerDTO } from '../src/dto/player/player.dto';
import { PlayerController } from '../src/player/player.controller';
import { PlayerService } from '../src/player/player.service';
import { Repository } from 'typeorm';

const playerDtos: PlayerDTO[] = [
  {
    teamId: 1,
    name: 'Jim',
    jerseyNum: 1,
  },
  {
    teamId: 2,
    name: 'Sally',
    jerseyNum: 2,
  },
];

describe('PlayerController', () => {
  let controller: PlayerController;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        { provide: 'PlayerRepository', useClass: Repository },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call player service to create', () => {
    const player: PlayerDTO = new PlayerDTO();
    const spy = jest.spyOn(playerService, 'savePlayer').mockImplementation(() => {
      return new Promise<void>(() => {
        return;
      });
    });
    controller.createPlayer(player);
    expect(spy).toBeCalledWith(player);
  });

  it('should call player service to get players by team id', () => {
    const teamId = 1;
    jest.spyOn(playerService, 'getPlayers').mockResolvedValue(playerDtos);
    const response = controller.getPlayersbyTeamId(teamId);
    expect(response).resolves.toBe(playerDtos);
  });

});
