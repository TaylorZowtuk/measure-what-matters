import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()

export class Team extends BaseEntity {

    @PrimaryGeneratedColumn()
    teamId : number;

    @Column({unique: true})
    name : string;

    @ManyToOne(type => User, user => user.userId, {eager: true})
    @JoinColumn()
    userId: number;
    
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}