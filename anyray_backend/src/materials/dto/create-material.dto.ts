// src/materials/dto/create-material.dto.ts
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
  } from 'class-validator';

  import { LanguageLevel, MaterialType } from '../../materials/entities/material.entity';
  
  export class CreateMaterialDto {
    @IsString()
    @IsNotEmpty()
    link: string;
  
    @IsUUID()
    languageId: string;
  
    @IsEnum(LanguageLevel)
    language_level: LanguageLevel;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsEnum(MaterialType)
    material_type: MaterialType;
  }
  
