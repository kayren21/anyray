import { IsOptional, IsString } from 'class-validator';

export class UpdateDefinitionDto {
  @IsOptional()
  @IsString()
  definition?: string;
}
