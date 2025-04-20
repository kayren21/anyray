import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateExampleDto {

    @IsString()
    @IsNotEmpty()
    example: string;
  
    @IsUUID()
    @IsNotEmpty()
    lexemeId: string;
  }
  

