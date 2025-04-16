import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Material } from '../../materials/entities/material.entity';


@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;


  @OneToMany(() => User, (user) => user.translationLanguage)
  users: User[];

  @OneToMany(() => Material, (material) => material.language)
  materials: Material[];  
 
}










