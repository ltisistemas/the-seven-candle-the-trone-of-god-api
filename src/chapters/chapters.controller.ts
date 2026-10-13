import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/infrastructure/jwt-auth.guard';
import { EmptyQueryDto } from '../common/validation/empty-query.dto';
import { emptyQuerySchema } from '../common/validation/empty-query.schema';
import { ZodValidationPipe } from '../common/validation/zod-validation.pipe';
import { ChaptersService } from './chapters.service';

@Controller('chapters')
@UseGuards(JwtAuthGuard)
export class ChaptersController {
  constructor(private readonly chapters: ChaptersService) {}

  @Get()
  list(@Query(new ZodValidationPipe(emptyQuerySchema)) _query: EmptyQueryDto) {
    return this.chapters.list();
  }
}