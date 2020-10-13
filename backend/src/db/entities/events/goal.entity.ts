import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IEvent } from "./IEvent.interface";

@Entity()

export class Goal extends BaseEntity implements IEvent{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    matchId: number;

    @Column()
    time: number;

    @Column()
    isHomeTeam: boolean;

    @Column()
    playerId: number;

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}

