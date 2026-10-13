import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ChapterEntity } from './infrastructure/persistence/chapter.entity';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChapterEntity]), AuthModule],
  controllers: [ChaptersController],
  providers: [ChaptersService],
})
export class ChaptersModule {}