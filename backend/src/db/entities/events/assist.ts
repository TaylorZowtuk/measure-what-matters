import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Goal extends BaseEntity {

    @PrimaryGeneratedColumn()
    eventId : number;

    @Column()
    matchId: number;

    @Column()
    time: string;

    @Column()
    isHomeTeam: boolean;

    

}