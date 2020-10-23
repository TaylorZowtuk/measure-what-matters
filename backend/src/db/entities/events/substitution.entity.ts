import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Match } from "../match.entity";
import { Player } from "../player.entity";

@Entity()

export class Substitution extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id : number;

    @ManyToOne(type => Player, player => player.playerId, {eager: true})
    @JoinColumn()
    playerId: number;

    @ManyToOne(type => Match, match => match.matchId, {eager: true})
    @JoinColumn()
    matchId: number;

    @Column({type: "bigint"})
    timeOn: number;

    @Column({nullable : true, type: "bigint"})
    timeOff: number; 

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}

