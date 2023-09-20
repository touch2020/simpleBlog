import { BoardStatus } from "../boardStatus.enum"
import { IsNotEmpty } from "class-validator"

export class UpdateBoardDto{
    @IsNotEmpty()
    id: number
    title: string
    content: string
    status: BoardStatus
}