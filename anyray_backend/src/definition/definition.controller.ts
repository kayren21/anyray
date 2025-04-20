import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { DefinitionService } from './definition.service';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';

@Controller('definition')
export class DefinitionController {
  constructor(private readonly definitionService: DefinitionService) {}

  @Post()
  create(@Body() dto: CreateDefinitionDto) {
    return this.definitionService.create(dto);
  }

  @Get('lexeme/:lexemeId')
  findByLexeme(@Param('lexemeId') lexemeId: string) {
    return this.definitionService.findByLexeme(lexemeId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDefinitionDto) {
    return this.definitionService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.definitionService.delete(id);
  }
}
