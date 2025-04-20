import { PartialType } from '@nestjs/mapped-types';
import { CreateExampleDto } from './create-example.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateExampleDto extends PartialType(CreateExampleDto) {
    @IsString()
    @IsOptional()
    example?: string;
}

