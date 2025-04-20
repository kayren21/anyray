import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { Lexeme } from '../../lexeme/entities/lexeme.entity';
  
  @Entity('translations')
  export class Translation {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    translation: string;
  
    @Column({name: 'source_detail', type: 'varchar', length: 255, nullable: true })
    sourceDetail?: string; 
  
    @ManyToOne(() => Lexeme, (lexeme) => lexeme.translations, {
      onDelete: 'CASCADE',
      nullable: false,
    })
    @JoinColumn({ name: 'lexeme_id' })
    lexeme: Lexeme;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }
  