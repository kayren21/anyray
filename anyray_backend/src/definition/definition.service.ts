import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Definition } from './entities/definition.entity';
import { CreateDefinitionDto } from './dto/create-definition.dto';
import { Lexeme } from '../lexeme/entities/lexeme.entity';

@Injectable()
export class DefinitionService {
  constructor(
    @InjectRepository(Definition)
    private defRepo: Repository<Definition>,

    @InjectRepository(Lexeme)
    private lexemeRepo: Repository<Lexeme>,
  ) {}

  async createOrUpdate(dto: CreateDefinitionDto): Promise<Definition> {
    const lexeme = await this.lexemeRepo.findOneBy({ id: dto.lexemeId });
    if (!lexeme) throw new Error('Lexeme not found');
  
    const existing = await this.defRepo.findOne({
      where: {
        lexeme: { id: dto.lexemeId },
        source_detail: dto.source_detail,
      },
      relations: ['lexeme'],
    });
  
    if (existing) {
      existing.definition = dto.definition;
      return this.defRepo.save(existing); // update
    }
  
    const definition = this.defRepo.create({
      definition: dto.definition,
      source_detail: dto.source_detail,
      lexeme,
    });
  
    return this.defRepo.save(definition); // insert
  } 

  async findByLexeme(lexemeId: string): Promise<Definition[]> {
    return this.defRepo.find({
      where: { lexeme: { id: lexemeId } },
      relations: ['lexeme'],
      order: { created_at: 'DESC' },
    });
  }  

}

