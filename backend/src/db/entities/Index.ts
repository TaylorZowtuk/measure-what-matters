import { User } from './user.entity';
import { Team } from './team.entity';
import { Player } from './player.entity';
import { Match } from './match.entity';
import { Lineup } from './lineup.entity';
import { Goal } from './events/goal.entity';
import { Assist } from './events/assist.entity';
import { Possession } from './events/possession.entity';
import { Shot } from './events/shot.entity';
import { Substitution } from './events/substitution.entity';

export {
  User,
  Team,
  Player,
  Match,
  Lineup,
  Goal,
  Assist,
  Possession,
  Shot,
  Substitution,
}; // Re-export entities here
