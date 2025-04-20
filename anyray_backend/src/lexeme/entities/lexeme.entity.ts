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

export enum InputType {
  MANUAL = 'manual',
  AUTO = 'auto',
}
@Entity('lexemes')
export class Lexeme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  lexeme: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sourceUrl: string;

  @Column({
    type: 'enum',
    enum: InputType,
    nullable: true,
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

}
