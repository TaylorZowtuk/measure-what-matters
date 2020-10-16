import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IEvent } from "./IEvent.interface";
import { Match } from "../match.entity";
import { Player } from "../player.entity";

@Entity()

export class Goal extends BaseEntity implements IEvent{

    @PrimaryGeneratedColumn()
    id : number;

    @ManyToOne(type => Match, match => match.matchId, {eager: true})
    @JoinColumn()
    matchId: number;

    @Column()
    time: number;

    @ManyToOne(type => Player, player => player.playerId, {eager: true})
    @JoinColumn()
    playerId: number;

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}

