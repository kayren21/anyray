import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';

  import { Lexeme } from '../../lexeme/entities/lexeme.entity';
  
  
  @Entity('definitions')
  export class Definition {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    definition: string;
  
    @Column({ type: 'varchar', length: 255 })
    source_detail: string; 
  
    @ManyToOne(() => Lexeme, (lexeme) => lexeme.definitions, { onDelete: 'CASCADE' })
    lexeme: Lexeme;
  
    @CreateDateColumn()
    created_at: Date;
  }
  