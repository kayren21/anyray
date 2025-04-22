
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  
  import { Language } from '../../languages/entities/language.entity';
  
  export enum LanguageLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
    ALL = 'all',
  }
  
  export enum MaterialType {
    VIDEO = 'video',
    ARTICLE = 'article',
    PODCAST = 'podcast',
    BOOK = 'book',
    OTHER = 'other',
    NEWS = 'news',
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
  
    @Column({ type: 'enum', enum: MaterialType, nullable: true  })
    material_type: MaterialType;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

  }
  