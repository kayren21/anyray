import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  create(@Body() dto: CreateTranslationDto) {
    return this.translationService.create(dto);
  }


  @Get('lexeme/:lexemeId')
  findByLexeme(@Param('lexemeId') lexemeId: string) {
    return this.translationService.findByLexeme(lexemeId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTranslationDto) {
    return this.translationService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.translationService.delete(id);
  }
}


