import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Definition } from './entities/definition.entity';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { UpdateDefinitionDto } from './dto/update-definition.dto';
import { Lexeme } from '../lexeme/entities/lexeme.entity';
import { ExerciseService } from 'src/exercise/exercise.service';

@Injectable()
export class DefinitionService {
  constructor(
    @InjectRepository(Definition)
    private readonly repo: Repository<Definition>,

    @InjectRepository(Lexeme)
    private readonly lexemeRepo: Repository<Lexeme>,

    private readonly exerciseService: ExerciseService,
  ) {}

  async create(dto: CreateDefinitionDto): Promise<Definition> {
    const lexeme = await this.lexemeRepo.findOneBy({ id: dto.lexemeId });
    if (!lexeme) throw new NotFoundException('Lexeme not found');

    const entity = this.repo.create({
      definition: dto.definition,
      lexeme,
    });

    const savedDefinition = await this.repo.save(entity);

    // Generate exercise if it doesn't exist
    try {
      await this.exerciseService.generateDefinitionExercise(dto.lexemeId);
    } catch (error) {
      console.warn(`Could not generate definition exercise: ${error.message}`);
    }

    return savedDefinition;
  }


  async findByLexeme(lexemeId: string): Promise<Definition[]> {
    return this.repo.find({
      where: { lexeme: { id: lexemeId } },
      relations: ['lexeme'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateDefinitionDto): Promise<Definition> {
    const def = await this.repo.findOneBy({ id });
    if (!def) throw new NotFoundException('Definition not found');

    Object.assign(def, dto);
    return this.repo.save(def);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Definition not found');
  }
}
