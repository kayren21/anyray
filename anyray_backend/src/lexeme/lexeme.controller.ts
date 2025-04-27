import { Controller, Get, Post, Body, Param, Delete, Patch} from '@nestjs/common';
import { LexemeService } from './lexeme.service';
import { CreateLexemeDto } from './dto/create-lexeme.dto';
import { ReviewLexemeDto } from './dto/review-lexeme.dto'; 


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

  @Get(':hubId/today-review')
  async getLexemesForToday(@Param('hubId') hubId: string) {
    return this.lexemeService.getLexemesForToday(hubId);
  }

  @Get(':hubId/mastered-stats')
  async getMasteredWordsStatsByHub(@Param('hubId') hubId: string) {
    return this.lexemeService.getMasteredWordsStatsByHub(hubId);
  }

  @Patch(':lexemeId/review')
  async reviewLexeme(
    @Param('lexemeId') lexemeId: string,
    @Body() dto: ReviewLexemeDto,
  ) {
    return this.lexemeService.updateAfterReview(lexemeId, dto.quality);
  }

}
