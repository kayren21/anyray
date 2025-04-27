import {
  Controller,
  Post,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  async create(@Body() dto: CreateExerciseDto) {
    return this.exerciseService.createExercise(dto.lexemeId, dto.type);
  }

  @Post('generate-all/:hubId')
  async generateAllExercises(@Param('hubId') hubId: string) {
    return this.exerciseService.generateAllAvailableExercises(hubId);
  }

  @Post('generate/translation')
  async generateTranslation(@Body('lexemeId') lexemeId: string) {
    return this.exerciseService.generateTranslationExercise(lexemeId);
  }

  @Post('generate/definition')
  async generateDefinition(@Body('lexemeId') lexemeId: string) {
    return this.exerciseService.generateDefinitionExercise(lexemeId);
  }

  @Get('quiz-by-lexeme/:lexemeId')
  async getQuizzesByLexeme(@Param('lexemeId') lexemeId: string) {
    return this.exerciseService.generateQuizzesByLexeme(lexemeId);
  }












}
