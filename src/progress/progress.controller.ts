import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/infrastructure/jwt-auth.guard';
import { EmptyQueryDto } from '../common/validation/empty-query.dto';
import { emptyQuerySchema } from '../common/validation/empty-query.schema';
import { ZodValidationPipe } from '../common/validation/zod-validation.pipe';
import { ChapterIdParamsDto } from './application/dto/chapter-id.params.dto';
import { chapterIdParamsSchema } from './application/progress.schemas';
import { ProgressService } from './application/progress.service';

interface AuthenticatedRequest extends Request {
  user: { userId: string; email: string };
}

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Get()
  getMine(
    @Req() request: AuthenticatedRequest,
    @Query(new ZodValidationPipe(emptyQuerySchema)) _query: EmptyQueryDto,
  ) {
    return this.progress.getForUser(request.user.userId);
  }

  @Post('chapters/:chapterId/complete')
  completeChapter(
    @Req() request: AuthenticatedRequest,
    @Param(new ZodValidationPipe(chapterIdParamsSchema)) params: ChapterIdParamsDto,
  ) {
    return this.progress.completeChapter(request.user.userId, params.chapterId);
  }
}