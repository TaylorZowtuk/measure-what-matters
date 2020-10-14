import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()

export class Substitution extends BaseEntity {

    @PrimaryGeneratedColumn()
    Id : number;

    @Column()
    playerId: number;

    @Column()
    matchId : number;

    @Column()
    timeOn: number;

    @Column()
    timeOff: number; 

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}

