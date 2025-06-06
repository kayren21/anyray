import { Module } from '@nestjs/common';
import { DefinitionService } from './definition.service';
import { DefinitionController } from './definition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Definition } from 'src/definition/entities/definition.entity';
import { Lexeme } from 'src/lexeme/entities/lexeme.entity';
import { ExerciseModule } from 'src/exercise/exercise.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Definition, Lexeme]), ExerciseModule,
    ],
  controllers: [DefinitionController],
  providers: [DefinitionService],
})
export class DefinitionModule {}
