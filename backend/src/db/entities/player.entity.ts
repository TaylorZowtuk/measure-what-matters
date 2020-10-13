import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}