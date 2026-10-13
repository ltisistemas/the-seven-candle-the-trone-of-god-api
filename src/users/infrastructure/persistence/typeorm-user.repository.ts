import { ConflictException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserRepository } from '../../domain/user.repository';
import { ChapterEntity } from '../../../chapters/infrastructure/persistence/chapter.entity';
import { PlayerProgressEntity, ProgressStatus } from '../../../progress/infrastructure/persistence/player-progress.entity';
import { UserEntity } from './user.entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  private readonly users: Repository<UserEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.users = dataSource.getRepository(UserEntity);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.users.findOne({
      where: { email },
      select: { id: true, email: true, passwordHash: true, currentLevel: true, createdAt: true },
    });
  }

  async createWithInitialProgress(email: string, passwordHash: string): Promise<UserEntity> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const user = await manager.save(UserEntity, manager.create(UserEntity, { email, passwordHash }));
        const chapters = await manager.find(ChapterEntity, { order: { chapterNumber: 'ASC' } });
        if (chapters.length !== 22) {
          throw new Error('Expected exactly 22 chapters; run database migrations first.');
        }
        await manager.save(
          PlayerProgressEntity,
          chapters.map((chapter, index) =>
            manager.create(PlayerProgressEntity, {
              userId: user.id,
              chapterId: chapter.id,
              status: index === 0 ? ProgressStatus.IN_PROGRESS : ProgressStatus.LOCKED,
            }),
          ),
        );
        return user;
      });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException('Email is already registered.');
      }
      throw error;
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
  }
}