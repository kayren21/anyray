// src/materials/material.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  import { Language } from '../../languages/entities/language.entity';
  
  export enum LanguageLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
  }
  
  export enum MaterialType {
    VIDEO = 'video',
    ARTICLE = 'article',
    PODCAST = 'podcast',
  }
  
  @Entity('materials')
  export class Material {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    link: string;
  
    @ManyToOne(() => Language, (language) => language.materials, { onDelete: 'CASCADE' })
    language: Language;
  
    @Column({ type: 'enum', enum: LanguageLevel })
    language_level: LanguageLevel;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ type: 'enum', enum: MaterialType })
    material_type: MaterialType;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  