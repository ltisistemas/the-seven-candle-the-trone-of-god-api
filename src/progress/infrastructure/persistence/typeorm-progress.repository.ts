import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChapterEntity } from '../../../chapters/infrastructure/persistence/chapter.entity';
import { UserEntity } from '../../../users/infrastructure/persistence/user.entity';
import { ProgressRepository } from '../../domain/progress.repository';
import { PlayerProgressEntity, ProgressStatus } from './player-progress.entity';

@Injectable()
export class TypeOrmProgressRepository implements ProgressRepository {
  constructor(private readonly dataSource: DataSource) {}

  findByUser(userId: string): Promise<PlayerProgressEntity[]> {
    return this.dataSource.getRepository(PlayerProgressEntity).find({
      where: { userId },
      relations: { chapter: true },
      order: { chapter: { chapterNumber: 'ASC' } },
    });
  }

  async completeChapterAndUnlockNext(userId: string, chapterId: string): Promise<PlayerProgressEntity[]> {
    return this.dataSource.transaction(async (manager) => {
      const progressRepository = manager.getRepository(PlayerProgressEntity);
      const current = await progressRepository.findOne({
        where: { userId, chapterId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!current) throw new NotFoundException('Chapter progress was not found.');
      if (current.status === ProgressStatus.LOCKED) {
        throw new NotFoundException('This chapter is locked.');
      }

      const chapter = await manager.findOneByOrFail(ChapterEntity, { id: chapterId });
      current.status = ProgressStatus.COMPLETED;
      await progressRepository.save(current);

      const nextChapter = await manager.findOneBy(ChapterEntity, { chapterNumber: chapter.chapterNumber + 1 });
      if (nextChapter) {
        await progressRepository.update(
          { userId, chapterId: nextChapter.id, status: ProgressStatus.LOCKED },
          { status: ProgressStatus.IN_PROGRESS },
        );
      }
      await manager.getRepository(UserEntity).update(
        { id: userId },
        { currentLevel: nextChapter?.chapterNumber ?? 22 },
      );

      return progressRepository.find({
        where: { userId },
        relations: { chapter: true },
        order: { chapter: { chapterNumber: 'ASC' } },
      });
    });
  }
}