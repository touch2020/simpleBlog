import { User } from './user.entity';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { userCreateDto } from './dto/userCreate.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './getUser.decorator';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('/signup')
    signUp(@Body(ValidationPipe) userCreateDto: userCreateDto): Promise<{}>{
        return this.authService.signUp(userCreateDto)
    }

    @Post('/signin')
    async signIn(@Body(ValidationPipe) userCreateDto: userCreateDto, @Res() res: Response): Promise<any>{
        const jwt =  await this.authService.signIn(userCreateDto)
        res.setHeader('Authorization', 'Bearer '+jwt.accessToken);
        res.cookie('access_token',jwt.accessToken,{
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000 //1 day
        });

        return res.send({
            message: 'success',
            access_token: jwt.accessToken
        })
    }

    @Post('/logout')
    logout(@Res() res: Response): any{
        res.cookie('access_token', 'none', {
            httpOnly: false,
            maxAge: 0
        })
        return res.send({
            message: 'success'
        })
    }

    @Post('/me')
    me(@Req() req: Request, @Res() res: Response){
        console.log("cookie", req.cookies.access_token)
        return this.authService.authCheck(req,res)
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User){
        console.log('user', user)
    }

    @Get('hello')
    hello(){
        return 'hello'
    }
}
