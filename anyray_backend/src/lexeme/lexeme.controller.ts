import { Controller, Get, Post, Body } from '@nestjs/common';
import { LexemeService } from './lexeme.service';
import { CreateLexemeDto } from './dto/create-lexeme.dto';

@Controller('lexeme')
export class LexemeController {
  constructor(private readonly lexemeService: LexemeService) {}

  @Post()
  create(@Body() createLexemeDto: CreateLexemeDto) {
    return this.lexemeService.create(createLexemeDto);
  }

  @Get()
  findAll() {
    return this.lexemeService.findAll();
  }
}
