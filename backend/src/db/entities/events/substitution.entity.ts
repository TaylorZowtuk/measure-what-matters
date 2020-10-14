import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Match } from "../match.entity";
import { Player } from "../player.entity";

@Entity()

export class Substitution extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id : number;

    @ManyToOne(type => Player, player => player.playerId)
    @JoinColumn()
    playerId: number;

    @ManyToOne(type => Match, match => match.matchId)
    @JoinColumn()
    matchId: number;

    @Column()
    timeOn: number;

    @Column({nullable : true})
    timeOff: number; 

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}

