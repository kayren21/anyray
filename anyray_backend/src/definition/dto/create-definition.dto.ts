import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateDefinitionDto {
  @IsString()
  @IsNotEmpty()
  definition: string;

  @IsUUID()
  @IsNotEmpty()
  lexemeId: string;
}

