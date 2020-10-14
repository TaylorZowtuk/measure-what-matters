import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()

export class Match extends BaseEntity {

    @PrimaryGeneratedColumn()
    matchId : number;

    @Column()
    teamId: number;

    @Column()
    time: number;

    @Column()
    isHomeTeam: boolean;

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;

}