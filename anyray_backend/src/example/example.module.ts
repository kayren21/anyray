import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleController } from './example.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Example } from 'src/example/entities/example.entity';
import { Lexeme } from 'src/lexeme/entities/lexeme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Example, Lexeme])],
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class ExampleModule {}

