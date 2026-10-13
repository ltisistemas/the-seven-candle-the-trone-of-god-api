import { Inject, Injectable } from '@nestjs/common';
import { PROGRESS_REPOSITORY, ProgressRepository } from '../domain/progress.repository';

@Injectable()
export class ProgressService {
  constructor(@Inject(PROGRESS_REPOSITORY) private readonly progress: ProgressRepository) {}

  getForUser(userId: string) {
    return this.progress.findByUser(userId);
  }

  completeChapter(userId: string, chapterId: string) {
    return this.progress.completeChapterAndUnlockNext(userId, chapterId);
  }
}