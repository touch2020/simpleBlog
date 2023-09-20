import { User } from './../auth/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm"
import { BoardStatus } from "./boardStatus.enum"

@Entity('board')
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title: string

    @Column()
    content: string

    @Column()
    status: BoardStatus

    @ManyToOne(type => User, user => user.boards, {eager: false})
    user: User
}