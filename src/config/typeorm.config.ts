import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { join } from "path/posix"
import * as config from 'config'

const dbConfig = config.get('db')
export const typeORMConfig : TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.HOSTNAME || dbConfig.host,
    port: process.env.PORT || dbConfig.port,
    username: process.env.USERNAME || dbConfig.username,
    password: process.env.PASSWORD || dbConfig.password,
    database: process.env.DATABASE || dbConfig.database,
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    synchronize: dbConfig.synchronize
}