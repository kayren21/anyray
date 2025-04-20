import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Example } from './entities/example.entity';
import { Lexeme } from '../lexeme/entities/lexeme.entity';
import { CreateExampleDto } from './dto/create-example.dto';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private readonly exampleRepo: Repository<Example>,

    @InjectRepository(Lexeme)
    private readonly lexemeRepo: Repository<Lexeme>,
  ) {}

  async create(dto: CreateExampleDto): Promise<Example> {
    const lexeme = await this.lexemeRepo.findOneByOrFail({ id: dto.lexemeId });
    const entity = this.exampleRepo.create({ example: dto.example, lexeme });
    return this.exampleRepo.save(entity);
  }

  async update(id: string, dto: Partial<CreateExampleDto>): Promise<Example> {
    const existing = await this.exampleRepo.findOneByOrFail({ id });
    if (dto.example) existing.example = dto.example;
    return this.exampleRepo.save(existing);
  }

  async findByLexeme(lexemeId: string): Promise<Example[]> {
    return this.exampleRepo.find({
      where: { lexeme: { id: lexemeId } },
      relations: ['lexeme'],
      order: { created_at: 'DESC' },
    });
  }

  async remove(id: string): Promise<void> {
    await this.exampleRepo.delete(id);
  }
}
