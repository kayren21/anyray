import { Module } from '@nestjs/common';
import { LexemeService } from './lexeme.service';
import { LexemeController } from './lexeme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lexeme } from './entities/lexeme.entity';
import { Hub } from 'src/hub/entities/hub.entity';
import { HubModule } from 'src/hub/hub.module';
import { ExerciseModule } from 'src/exercise/exercise.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Lexeme, Hub]), HubModule, ExerciseModule, ],
  controllers: [LexemeController],
  providers: [LexemeService],
})
export class LexemeModule {}
