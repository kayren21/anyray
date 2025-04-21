import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Language } from '../../languages/entities/language.entity';
import { Lexeme } from 'src/lexeme/entities/lexeme.entity';

export enum LanguageLevel {
  BEGINNER = 'beginner',
  ELEMENTARY = 'elementary',
  PRE_INTERMEDIATE = 'pre-intermediate',
  INTERMEDIATE = 'intermediate',
  UPPER_INTERMEDIATE = 'upper-intermediate',
  ADVANCED = 'advanced',
  PROFICIENT = 'proficient',
}

@Entity('hubs')
export class Hub {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Language, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'target_language' })
  targetLanguage: Language;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: LanguageLevel,
    nullable: false, 
    name: 'language_level'
  })
  languageLevel: LanguageLevel;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'is_default',
    type: 'boolean',
    default: false,
  })
  isDefault: boolean;

  @OneToMany(() => Lexeme, (lexeme) => lexeme.hub)
  lexemes: Lexeme[];
}
