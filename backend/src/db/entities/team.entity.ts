import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()

export class Team extends BaseEntity {

    @PrimaryGeneratedColumn()
    teamId : number;

    @Column()
    name : string;

    @Column()
    coachId: number;
    
}