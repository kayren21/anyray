import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm';

  import { Lexeme } from '../../lexeme/entities/lexeme.entity';
  
  
  @Entity('definitions')
  export class Definition {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    definition: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    source_detail: string; 
  
    @ManyToOne(() => Lexeme, (lexeme) => lexeme.definitions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lexeme_id' })
    lexeme: Lexeme;
  
    @CreateDateColumn()
    created_at: Date;
  }
  