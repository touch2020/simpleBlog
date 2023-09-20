import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { Board } from './boards/board.entity';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    BoardsModule,
    AuthModule,
    UploadsModule
  ]
})
export class AppModule {}
