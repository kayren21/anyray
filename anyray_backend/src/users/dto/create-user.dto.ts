import { IsString, IsNotEmpty, IsInt, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  gender: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUUID()
  homeLandId: string;

  @IsUUID()
  @IsNotEmpty()
  translationLanguageId: string;
}
