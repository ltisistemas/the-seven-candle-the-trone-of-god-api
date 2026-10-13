import { IsUUID } from 'class-validator';

export class ChapterIdParamsDto {
  @IsUUID()
  chapterId!: string;
}