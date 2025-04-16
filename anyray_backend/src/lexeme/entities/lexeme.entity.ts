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

  @CreateDateColumn()
  savedDate: Date;

  @Column({ type: 'varchar', length: 255 })
  sourceUrl: string;

  @Column({
    type: 'enum',
    enum: InputType,
    nullable: false,
  })
  inputType: InputType;

  @ManyToOne(() => Hub, (hub) => hub.lexemes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hub_id' })
  hub: Hub;

  @OneToMany(() => Definition, (definition) => definition.lexeme)
  definitions: Definition[];

}
