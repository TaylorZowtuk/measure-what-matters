import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Goal extends BaseEntity {

    @PrimaryGeneratedColumn()
    goalId : number;

    @Column()
    matchId: number;

    @Column()
    time: string;

    @Column()
    isHomeTeam: boolean;

    @Column()
    playerId: number;

}

