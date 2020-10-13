import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Goal extends BaseEntity {

    @PrimaryGeneratedColumn()
    matchId : number;

    @Column()
    teamId: number;

    @Column()
    time: string;

    @Column()
    isHomeTeam: boolean;

    @Column()
    playerId: number;

}

