import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IEvent } from "./IEvent.interface";

@Entity()

export class Goal extends BaseEntity implements IEvent{

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    matchId: number;

    @Column()
    time: string;

    @Column()
    isHomeTeam: boolean;

    @Column()
    playerId: number;

}