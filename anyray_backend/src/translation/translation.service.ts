import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './entities/translation.entity';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { Lexeme } from '../lexeme/entities/lexeme.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translation)
    private repo: Repository<Translation>,

    @InjectRepository(Lexeme)
    private lexemeRepo: Repository<Lexeme>,
  ) {}

  async create(dto: CreateTranslationDto): Promise<Translation> {
    const lexeme = await this.lexemeRepo.findOneBy({ id: dto.lexemeId });
    if (!lexeme) throw new NotFoundException('Lexeme not found');

    const newTranslation = this.repo.create({
      translation: dto.translation,
      lexeme,
    });

    return this.repo.save(newTranslation);
  }


  async findByLexeme(lexemeId: string): Promise<Translation[]> {
    return this.repo.find({
      where: { lexeme: { id: lexemeId } },
      relations: ['lexeme'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateTranslationDto): Promise<Translation> {
    const translation = await this.repo.findOneBy({ id });
    if (!translation) throw new NotFoundException('Translation not found');

    Object.assign(translation, dto);
    return this.repo.save(translation);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Translation not found');
  }
}
