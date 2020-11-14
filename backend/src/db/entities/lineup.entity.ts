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
import { Match } from './match.entity';

@Entity()
export class Lineup extends BaseEntity {
  @PrimaryGeneratedColumn()
  lineupId: number;

  @ManyToOne(
    type => Match,
    match => match.matchId,
    { eager: true },
  )
  @JoinColumn()
  matchId: number;

  @Column('int', { array: true })
  lineup: number[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
