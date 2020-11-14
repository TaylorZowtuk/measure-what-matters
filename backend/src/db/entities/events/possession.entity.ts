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
import { IEvent } from './IEvent.interface';
import { Match } from '../match.entity';
import { Player } from '../player.entity';

@Entity()
export class Possession extends BaseEntity implements IEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Match,
    match => match.matchId,
    { eager: true },
  )
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @Column()
  matchId: number;

  @Column({ type: 'int' })
  time: number;

  @ManyToOne(
    () => Player,
    player => player.playerId,
    { eager: true, nullable: true },
  )
  @JoinColumn({ name: 'playerId' })
  player: Player;

  @Column({ nullable: true })
  playerId: number;

  @Column({ type: 'bool' })
  neutral: boolean;

  @Column({ type: 'bool', default: false })
  archived: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
