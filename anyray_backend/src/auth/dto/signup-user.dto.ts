import { IsEmail, IsString, MinLength, IsUUID } from 'class-validator';

export class SignupUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsUUID()
  translationLanguageId: string;
}
