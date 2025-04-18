import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
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
