import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()

export class Player extends BaseEntity {

    @PrimaryGeneratedColumn()
    playerId : number;

    @Column()
    teamId: number;

    @Column()
    name: string;

    @Column()
    jerseyNum: number;

}