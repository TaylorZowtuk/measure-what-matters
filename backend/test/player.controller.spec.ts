import { TestingModule, Test } from '@nestjs/testing';
import { PlayerDTO } from '../src/dto/player/player.dto';
import { PlayerController } from '../src/player/player.controller';
import { PlayerService } from '../src/player/player.service';
import { Repository } from 'typeorm';
import { PlayerArrayDTO } from '../src/dto/player/playerArray.dto';
import { Player } from '../src/db/entities/player.entity';

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
    const playerArrayDTO: PlayerArrayDTO = {
      playerArray: playerDtos,
    };
    const spy = jest
      .spyOn(playerService, 'savePlayer')
      .mockImplementation(() => {
        return new Promise<Player[]>(() => {
          return;
        });
      });
    controller.createPlayers(playerArrayDTO);
    expect(spy).toBeCalledWith(playerArrayDTO);
  });

  it('should call player service to get players by team id', () => {
    const teamId = 1;
    jest.spyOn(playerService, 'getPlayers').mockResolvedValue(playerDtos);
    const response = controller.getPlayersByTeamId(teamId);
    expect(response).resolves.toBe(playerDtos);
  });
});
