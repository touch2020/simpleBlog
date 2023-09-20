import { User } from './../auth/user.entity';
import { Repository, EntityRepository } from "typeorm";
import { Board } from "./board.entity";
import { BoardStatus } from "./boardStatus.enum";
import { CreateBoardDto } from "./dto/CreateBoard.dto";

@EntityRepository(Board)
 export class BoardRepository extends Repository<Board>{
    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board>{
        const {title, content} = createBoardDto

        const board = this.create({
            title,
            content,
            status: BoardStatus.PUBLIC,
            user
        })

        await this.save(board)

        return board
    }

    async findAllBoard(limit: number, cursor?: number): Promise<Board[]>{
        const qb = this.createQueryBuilder('b').select(['b.id', 'b.title', 'b.content'])

        if(cursor != undefined) qb.andWhere('b.id < :cursor', {cursor: cursor})
        qb.orderBy('b.id', 'DESC')
        if(limit != undefined) qb.limit(limit)

        const boards = await qb.getMany()

        return boards
        
    }
}