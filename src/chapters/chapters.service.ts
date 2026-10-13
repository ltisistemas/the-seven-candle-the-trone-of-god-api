import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChapterEntity } from './infrastructure/persistence/chapter.entity';

@Injectable()
export class ChaptersService {
  constructor(@InjectRepository(ChapterEntity) private readonly chapters: Repository<ChapterEntity>) {}

  list(): Promise<ChapterEntity[]> {
    return this.chapters.find({ order: { chapterNumber: 'ASC' } });
  }
}