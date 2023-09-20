import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as config from 'config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(UserRepository)
        private readonly UserRepository: UserRepository
    ){
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload){
        const {username} = payload
        const user: User = await this.UserRepository.findOne({username})

        if(!user){
            throw new UnauthorizedException()
        }

        return user
    }
}