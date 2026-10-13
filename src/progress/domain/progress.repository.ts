import { PlayerProgressEntity } from '../infrastructure/persistence/player-progress.entity';

export const PROGRESS_REPOSITORY = Symbol('PROGRESS_REPOSITORY');

export interface ProgressRepository {
  findByUser(userId: string): Promise<PlayerProgressEntity[]>;
  completeChapterAndUnlockNext(userId: string, chapterId: string): Promise<PlayerProgressEntity[]>;
}