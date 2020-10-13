import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()

export class Team extends BaseEntity {

    @PrimaryGeneratedColumn()
    teamId : number;

    @Column()
    name : string;

    @Column()
    coachId: number;
    
    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}