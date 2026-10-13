import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ChapterEntity } from '../../../chapters/infrastructure/persistence/chapter.entity';
import { ProgressStatus } from '../../domain/progress-status';

export { ProgressStatus } from '../../domain/progress-status';

@Entity({ name: 'player_progress' })
export class PlayerProgressEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @PrimaryColumn({ name: 'chapter_id', type: 'uuid' })
  chapterId!: string;

  @ManyToOne(() => ChapterEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'chapter_id' })
  chapter!: ChapterEntity;

  @Column({ type: 'varchar', length: 20 })
  status!: ProgressStatus;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}