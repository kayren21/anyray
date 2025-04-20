import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateTranslationDto {
  @IsString()
  @IsNotEmpty()
  translation: string;

  @IsUUID()
  @IsNotEmpty()
  lexemeId: string;
}
