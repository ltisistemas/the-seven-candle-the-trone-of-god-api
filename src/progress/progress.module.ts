import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChapterEntity } from '../chapters/infrastructure/persistence/chapter.entity';
import { PlayerProgressEntity } from './infrastructure/persistence/player-progress.entity';
import { PROGRESS_REPOSITORY } from './domain/progress.repository';
import { TypeOrmProgressRepository } from './infrastructure/persistence/typeorm-progress.repository';
import { ProgressController } from './progress.controller';
import { ProgressService } from './application/progress.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChapterEntity, PlayerProgressEntity]), AuthModule],
  controllers: [ProgressController],
  providers: [
    ProgressService,
    { provide: PROGRESS_REPOSITORY, useClass: TypeOrmProgressRepository },
  ],
})
export class ProgressModule {}