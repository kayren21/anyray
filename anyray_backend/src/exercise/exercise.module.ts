import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { Lexeme } from 'src/lexeme/entities/lexeme.entity';
import { Translation } from 'src/translation/entities/translation.entity';
import { Definition } from 'src/definition/entities/definition.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, Lexeme, Translation, Definition])
  ],
  providers: [ExerciseService],
  controllers: [ExerciseController],
  exports: [ExerciseService],
})
export class ExerciseModule {}
