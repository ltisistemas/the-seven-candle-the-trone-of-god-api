import { Allow } from 'class-validator';

export class EmptyQueryDto {
  @Allow()
  readonly validationMarker?: never;
}