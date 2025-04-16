import { IsString, IsNotEmpty,IsUUID} from 'class-validator';

export class CreateCountryDto {
  @IsUUID()
  countryId: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
