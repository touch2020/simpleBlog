import { User } from './../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { create } from 'domain';
import { CreateContextOptions } from 'vm';
import { BoardStatus } from './boardStatus.enum';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/CreateBoard.dto';
import { UpdateBoardDto } from './dto/UpdateBoard.dto';
import { BoardStatusValidationPipe } from './pipes/boardStatusValidation.pipe';
import { Board } from './board.entity';
import { GetUser } from 'src/auth/getUser.decorator';
import { getCustomRepositoryToken } from '@nestjs/typeorm';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    constructor(private boardsService: BoardsService){}

    @Get()
    findAllBoard(@Query('limit') limit: number, @Query('cursor') cursor?: number): Promise<Board[]>{
        return this.boardsService.findAllBoards( limit, cursor)
    }

    @Get('/me')
    findMyBoards(
        @GetUser() user: User
    ): Promise<Board[]>{
        return this.boardsService.findMyBoards(user)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user: User
    ): Promise<Board>{
        return this.boardsService.createBoard(createBoardDto, user)
    }

    @Get('/:id')
    findBoardById(@Param('id', ParseIntPipe) id: number): Promise<Board>{
        return this.boardsService.findBoardById(id)
        
    }

    @Delete('/:id')
    deleteBoardById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void>{
        return this.boardsService.deleteBoardById(id, user)
    }

    @Patch('/')
    @UsePipes(ValidationPipe)
    updateBoard(@Body() updateBoardDto: UpdateBoardDto, @Body('status', BoardStatusValidationPipe) status: BoardStatus): Promise<Board>{
        return this.boardsService.updateBoardStatus(updateBoardDto)
    }
}
