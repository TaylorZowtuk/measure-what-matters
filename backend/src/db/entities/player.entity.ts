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
export class Player extends BaseEntity {
  @PrimaryGeneratedColumn()
  playerId: number;

  @ManyToOne(
    () => Team,
    team => team.teamId,
    { eager: true },
  )
  @JoinColumn()
  teamId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  jerseyNum: number;

  @Column({ type: 'bool', default: false })
  archived: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
