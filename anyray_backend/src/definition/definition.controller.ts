import { Controller, Post, Body, Get, Param} from '@nestjs/common';
import { DefinitionService } from './definition.service';
import { CreateDefinitionDto } from './dto/create-definition.dto';

@Controller('definitions')
export class DefinitionController {
  constructor(private readonly definitionService: DefinitionService) {}

  @Post()
  create(@Body() dto: CreateDefinitionDto) {
    return this.definitionService.createOrUpdate(dto);
  }

  @Get(':lexemeId')
  findByLexeme(@Param('lexemeId') lexemeId: string) {
  return this.definitionService.findByLexeme(lexemeId);
  }
}

