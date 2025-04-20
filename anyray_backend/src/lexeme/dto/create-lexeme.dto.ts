import { IsEnum, IsString, IsOptional, IsUUID, IsUrl } from 'class-validator';
import { InputType } from '../entities/lexeme.entity';

export class CreateLexemeDto {
  @IsString()
  lexeme: string;

  @IsUUID()
  hubId: string;

  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @IsOptional()
  @IsEnum(InputType)
  inputType?: InputType;
}
