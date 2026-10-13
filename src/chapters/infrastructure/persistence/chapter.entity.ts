import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'chapters' })
export class ChapterEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'chapter_number', type: 'smallint', unique: true })
  chapterNumber!: number;

  @Column({ length: 160 })
  title!: string;

  @Column({ name: 'region_unlocked', length: 100 })
  regionUnlocked!: string;

  @Column({ type: 'text' })
  description!: string;
}