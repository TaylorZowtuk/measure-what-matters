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
import { Match } from '../match.entity';
import { Player } from '../player.entity';
import { IEvent } from './IEvent.interface';

@Entity()
export class Assist extends BaseEntity implements IEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Match,
    match => match.matchId,
    { eager: true },
  )
  @JoinColumn()
  matchId: number;

  @Column()
  time: number;

  @ManyToOne(
    () => Player,
    player => player.playerId,
    { eager: true },
  )
  @JoinColumn()
  playerId: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
