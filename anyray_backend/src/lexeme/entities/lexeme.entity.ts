import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Hub } from '../../hub/entities/hub.entity';
import { Definition } from '../../definition/entities/definition.entity';
import { Example } from '../../example/entities/example.entity';
import { Translation } from '../../translation/entities/translation.entity';
import { Exercise } from 'src/exercise/entities/exercise.entity';

export enum InputType {
  MANUAL = 'manual',
  AUTO = 'auto',
}

export enum ExerciseStatus {
  NEW = 'new',
  LEARNING = 'learning',
  REVIEW = 'review',
  MASTERED = 'mastered',
}

@Entity('lexemes')
export class Lexeme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  lexeme: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 255, name: 'source_url', nullable: true })
  sourceUrl: string;

  @Column({
    type: 'enum',
    enum: InputType,
    nullable: true,
    name: 'input_type',
  })
  inputType: InputType;

  @ManyToOne(() => Hub, (hub) => hub.lexemes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hub_id' })
  hub: Hub;

  @OneToMany(() => Definition, (definition) => definition.lexeme, {nullable: true }) 
  definitions: Definition[];

  @OneToMany(() => Example, (example) => example.lexeme, {nullable: true })
  examples: Example[];

  @OneToMany(() => Translation, (translation) => translation.lexeme, {nullable: true })
  translations: Example[];

  @OneToMany(() => Exercise, (exercise) => exercise.lexeme, {nullable: true })
  exercises: Example[];

  @Column({ name: 'repetition_count', default: 0 })
repetitionCount: number;

@Column({ name: 'correct_streak', default: 0 })
correctStreak: number;

@Column({ name: 'ease_factor', type: 'float', default: 2.5 })
easeFactor: number;

@Column({ name: 'last_review', type: 'timestamp', nullable: true })
lastReview: Date;

@Column({ name: 'next_review', type: 'timestamp', nullable: true })
nextReview: Date;

@Column({ type: 'enum', enum: ExerciseStatus, default: ExerciseStatus.NEW })
status: ExerciseStatus;

@Column({  name: 'mastered_at', type: 'timestamp', nullable: true })
masteredAt: Date | null;


}
