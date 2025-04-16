import { PartialType } from '@nestjs/mapped-types';
import { CreateLexemeDto } from './create-lexeme.dto';

export class UpdateLexemeDto extends PartialType(CreateLexemeDto) {}
