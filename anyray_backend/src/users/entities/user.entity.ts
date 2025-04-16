import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  gender: string;

  @Column()
  dob: Date;

  @Column({ type: 'timestamp' })
  registeredDate: Date;

  @ManyToOne(() => Country, (country) => country.users, { eager: true })
  homeLandId: Country;

  @ManyToOne(() => Language, (language) => language.users, { eager: true })
  translationLanguage: Language;
}
