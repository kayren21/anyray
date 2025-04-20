import { IsOptional, IsString } from 'class-validator';

export class UpdateTranslationDto {
  @IsString()
  @IsOptional()
  translation?: string;
}
