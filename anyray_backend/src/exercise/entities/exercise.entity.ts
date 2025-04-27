import { Entity,
         PrimaryGeneratedColumn, 
         Column, 
         ManyToOne, 
         CreateDateColumn, 
         JoinColumn,} from 'typeorm';
import { Lexeme } from 'src/lexeme/entities/lexeme.entity';

export enum ExerciseType {
  MULTIPLE_CHOICE_TRANSLATION = 'multiple_choice_translation',
  MULTIPLE_CHOICE_DEFINITION = 'multiple_choice_definition',
  FILL_IN_THE_BLANK = 'fill_in_the_blank',
  SENTENCE = 'sentence',
  MATCHING = 'matching',
}


@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Lexeme, (lexeme) => lexeme.exercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lexeme_id' })
  lexeme: Lexeme;

  @Column({
    type: 'enum',
    enum: ExerciseType,
  })
  type: ExerciseType;


  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;


}
