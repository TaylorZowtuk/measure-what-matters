import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Team } from "./team.entity";

@Entity()

export class Match extends BaseEntity {

    @PrimaryGeneratedColumn()
    matchId : number;

    @ManyToOne(type => Team, team => team.teamId)
    @JoinColumn()
    teamId: number;

    @Column()
    time: number;

    @Column()
    isHomeTeam: boolean;

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;

}