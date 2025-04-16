import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateDefinitionDto {
  @IsString()
  @IsNotEmpty()
  definition: string;

  @IsString()
  @IsNotEmpty()
  source_detail: string;

  @IsUUID()
  lexemeId: string;
}

