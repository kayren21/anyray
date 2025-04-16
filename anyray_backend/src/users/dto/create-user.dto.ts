import { IsString, IsNotEmpty, IsInt, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  password: string;

  @IsUUID()
  homeLandId: string;

  @IsUUID()
  translationLanguageId: string;
}
