// src/materials/materials.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { Language } from '../languages/entities/language.entity';
import { Material } from '../materials/entities/material.entity';
import { LanguageLevel } from './entities/material.entity';


@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,

    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async create(dto: CreateMaterialDto): Promise<Material> {
    const language = await this.languageRepository.findOneBy({ id: dto.languageId });
    if (!language) throw new NotFoundException('Language not found');

    const material = this.materialRepository.create({
      ...dto,
      language,
    });

    return this.materialRepository.save(material);
  }

  findAll(): Promise<Material[]> {
    return this.materialRepository.find({ relations: ['language'] });
  }

  findOne(id: string): Promise<Material> {
    return this.materialRepository.findOne({ where: { id }, relations: ['language'] });
  }

  async remove(id: string): Promise<void> {
    await this.materialRepository.delete(id);
  }

  async findByLanguageAndLevel(languageId: string, level: LanguageLevel): Promise<Material[]> {
    return this.materialRepository.find({
      where: {
        language: { id: languageId },
        language_level: level,
      },
      relations: ['language'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByLanguage(languageId: string): Promise<Material[]> {
    return this.materialRepository.find({
      where: {
        language: { id: languageId },
      },
      relations: ['language'],
    });
  }
  
  
}

