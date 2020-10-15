
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Team } from "./team.entity";

@Entity()

export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    userId : number;

    @Column()
    name : string;

    @ManyToOne(type => Team, team => team.teamId, {nullable : true})
    @JoinColumn()
    teamId: number;

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;

}