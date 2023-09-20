import { User } from './../auth/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boardStatus.enum';
import {v1 as uuid} from 'uuid'
import { CreateBoardDto } from './dto/CreateBoard.dto';
import { UpdateBoardDto } from './dto/UpdateBoard.dto';
import { identity } from 'rxjs';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { create } from 'domain';
import { createQueryBuilder, getConnection, Repository } from 'typeorm';
import { title } from 'process';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
        private readonly customBoardRepository: BoardRepository){}
        

    async findAllBoards( limit: number, cursor?: number): Promise<Board[]>{
        const boards = this.customBoardRepository.findAllBoard(limit, cursor)
        
        return boards
    }

    async findMyBoards(user: User): Promise<Board[]>{
        const query = this.boardRepository.createQueryBuilder('board')

        query.where('board.userId = :userId', {userId: user.id})

        const boards = await query.getMany()

        return boards
    }

    async findBoard(id:number): Promise<Board>{
        const board = this.boardRepository.findOne({id})
        return board
    }

    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board>{
        return this.customBoardRepository.createBoard(createBoardDto, user)
    }

    async findBoardById(id: number): Promise<Board>{
        const board = await this.boardRepository.findOne(id)

        if(!board){
            throw new NotFoundException("Not found board.")
        }

        return board 
    }

    async deleteBoardById(id: number, user: User): Promise<void>{
        const result = await this.boardRepository.delete({id, user})

        if(result.affected === 0){
            throw new NotFoundException(`Not found board id:${id}`)
        }

        console.log('result', result)
    }

    async updateBoardStatus(updateBoardDto: UpdateBoardDto): Promise<Board>{
        const board = await this.findBoardById(updateBoardDto.id)

        if(updateBoardDto.content !== null){
            board.content = updateBoardDto.content
        }
        if(updateBoardDto.title !== null){
            board.title = updateBoardDto.title
        }
        if(updateBoardDto.status !== null){
            board.status = updateBoardDto.status
        }
        

        await this.boardRepository.save(board)

        return board
    }

}
