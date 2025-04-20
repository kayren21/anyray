import { IsOptional, IsString, IsEnum, IsUrl } from 'class-validator';
import { InputType } from '../entities/lexeme.entity';

export class UpdateLexemeDto {
  @IsOptional()
  @IsString()
  lexeme?: string;

  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @IsOptional()
  @IsEnum(InputType)
  inputType?: InputType;
}
