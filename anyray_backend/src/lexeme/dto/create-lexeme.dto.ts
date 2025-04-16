import { IsEnum, IsString, IsUrl, IsNotEmpty } from 'class-validator';
import { InputType } from '../entities/lexeme.entity';

export class CreateLexemeDto {
  @IsString()
  @IsNotEmpty()
  lexeme: string;

  @IsUrl()
  @IsNotEmpty()
  sourceUrl: string;

  @IsEnum(InputType)
  inputType: InputType;

  @IsString()
  @IsNotEmpty()
  hubId: string;
}
