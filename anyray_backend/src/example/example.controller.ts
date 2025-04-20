import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './dto/create-example.dto';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  create(@Body() dto: CreateExampleDto) {
    return this.exampleService.create(dto);
  }

  @Get('lexeme/:lexemeId')
  getByLexeme(@Param('lexemeId') id: string) {
    return this.exampleService.findByLexeme(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateExampleDto>) {
    return this.exampleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exampleService.remove(id);
  }
}
