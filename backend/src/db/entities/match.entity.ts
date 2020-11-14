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
  @JoinColumn()
  teamId: number;

  @Column({ type: 'bigint' })
  startTime: number;

  @Column()
  isHomeTeam: boolean;

  @Column({ nullable: true })
  halfTime: number;

  @Column({ nullable: true })
  fullTime: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
