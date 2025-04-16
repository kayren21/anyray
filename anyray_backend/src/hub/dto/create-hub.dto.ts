import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { LanguageLevel } from '../entities/hub.entity';

export class CreateHubDto {
  @IsUUID()
  @IsNotEmpty()
  target_language: string; // UUID of Language entity

  @IsUUID()
  @IsNotEmpty()
  user_id: string; // UUID of User entity

  @IsEnum(LanguageLevel)
  @IsNotEmpty()
  language_level: LanguageLevel;
}
