import { IsNumber } from 'class-validator';

export class ReviewLexemeDto {
  @IsNumber()
  quality: number;
}
