import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()

export class Team extends BaseEntity {

    @PrimaryGeneratedColumn()
    teamId : number;

    @Column()
    name : string;

    @ManyToOne(type => User, user => user.userId)
    @JoinColumn()
    userId: number;
    
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}