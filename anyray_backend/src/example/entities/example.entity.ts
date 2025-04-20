import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { Lexeme } from '../../lexeme/entities/lexeme.entity';
  
  @Entity('examples')
  export class Example {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'text' })
    example: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    source_detail: string;
  
    @ManyToOne(() => Lexeme, (lexeme) => lexeme.examples, { onDelete: 'CASCADE' })
    lexeme: Lexeme;


    @CreateDateColumn()
    created_at: Date;
  }
  
