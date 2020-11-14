import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from './team.entity';

@Entity()
export class Match extends BaseEntity {
  @PrimaryGeneratedColumn()
  matchId: number;

  @ManyToOne(
    () => Team,
    team => team.teamId,
    { eager: true },
  )
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  teamId: number;

  // Epoch time of game date/time
  @Column({ type: 'int' })
  startDate: number;

  // Epoch time of time recorded
  @Column()
  recordingStartTime: number;

  @Column({ nullable: true })
  halfTime: number;

  @Column({ nullable: true })
  fullTime: number;

  @Column()
  opponentTeamName: string;

  @Column()
  isHomeTeam: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
