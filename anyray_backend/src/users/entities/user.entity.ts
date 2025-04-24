import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({type: 'varchar', length: 150, unique: true, nullable: false }) 
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: false  })
  password: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
  gender: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ name: 'registered_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registeredDate: Date;

  @ManyToOne(() => Country, (country) => country.users, { eager: true, nullable: true})
  @JoinColumn({ name: 'homeland_id' })
  homeLandId: Country;

  @ManyToOne(() => Language, (language) => language.users, { eager: true, nullable: true })
  @JoinColumn({ name: 'translation_language' })
  translationLanguage: Language;
}
