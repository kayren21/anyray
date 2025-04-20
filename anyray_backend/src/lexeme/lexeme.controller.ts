import { Controller, Get, Post, Body, Param, Delete} from '@nestjs/common';
import { LexemeService } from './lexeme.service';
import { CreateLexemeDto } from './dto/create-lexeme.dto';

@Controller('lexeme')
export class LexemeController {
  constructor(private readonly lexemeService: LexemeService) {}

  @Post()
  create(@Body() createLexemeDto: CreateLexemeDto) {
    return this.lexemeService.create(createLexemeDto);
  }
   
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lexemeService.findById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.lexemeService.delete(id);
  }

  @Get('hub/:hubId')
  getLexemesByHub(@Param('hubId') hubId: string) {
    return this.lexemeService.findByHub(hubId);
  }

}
