import { BaseEntity, Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()

export class PlusMinus extends BaseEntity {

    @Column()
    matchId : number;

    @Column()
    isGoalFor : boolean;

    @Column()
    time: number;

    @Column()
    playerId: number;

    @CreateDateColumn()
    createdDate: Date;
  
    @UpdateDateColumn()
    updatedDate: Date;
}

