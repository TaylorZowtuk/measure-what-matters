import { BaseEntity, Column, Entity } from "typeorm";
import { IEvent } from './IEvent.interface';

@Entity()

export class PlusMinus extends BaseEntity {

    @Column()
    matchId : number;

    @Column()
    isGoalFor : boolean;

    @Column()
    time: string;

    @Column()
    playerId: number;

}

