// src/materials/materials.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Language } from '../languages/entities/language.entity';
import { Material } from '../materials/entities/material.entity';

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

  async update(id: string, dto: UpdateMaterialDto): Promise<Material> {
    const material = await this.materialRepository.findOneBy({ id });
    if (!material) throw new NotFoundException('Material not found');

    Object.assign(material, dto);
    return this.materialRepository.save(material);
  }

  async remove(id: string): Promise<void> {
    await this.materialRepository.delete(id);
  }
}

