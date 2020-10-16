import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Team } from "./team.entity";

@Entity()

export class Player extends BaseEntity {

    @PrimaryGeneratedColumn()
    playerId : number;

    @ManyToOne(type => Team, team => team.teamId)
    @JoinColumn()
    teamId: number;

    @Column()
    name: string;

    @Column()
    jerseyNum: number;

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}