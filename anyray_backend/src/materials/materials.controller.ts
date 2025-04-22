
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { LanguageLevel } from './entities/material.entity';


@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  create(@Body() dto: CreateMaterialDto) {
    return this.materialsService.create(dto);
  }

  @Get()
  findAll() {
    return this.materialsService.findAll();
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialsService.remove(id);
  }

  @Get('by-language/:languageId')
  getByLanguage(@Param('languageId') languageId: string) {
    return this.materialsService.findByLanguage(languageId);
  }

  
  @Get('by-language-and-level')
  getByLangAndLevel(
    @Query('languageId') languageId: string,
    @Query('level') level: LanguageLevel,
  ) {
    return this.materialsService.findByLanguageAndLevel(languageId, level);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialsService.findOne(id);
  }
}
