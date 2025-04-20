import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { Lexeme } from '../lexeme/entities/lexeme.entity';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Translation, Lexeme])],
  controllers: [TranslationController],
  providers: [TranslationService],
})
export class TranslationModule {}

