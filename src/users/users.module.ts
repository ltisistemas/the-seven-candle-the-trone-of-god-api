import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterEntity } from '../chapters/infrastructure/persistence/chapter.entity';
import { PlayerProgressEntity } from '../progress/infrastructure/persistence/player-progress.entity';
import { USER_REPOSITORY } from './domain/user.repository';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { UserEntity } from './infrastructure/persistence/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ChapterEntity, PlayerProgressEntity])],
  providers: [{ provide: USER_REPOSITORY, useClass: TypeOrmUserRepository }],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}