import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { Country } from '../countries/entities/country.entity';
import { Language } from '../languages/entities/language.entity';
import { Material } from '../materials/entities/material.entity';

import { countries } from './data/countries.data';
import { languages } from './data/languages.data';
import { materials } from './data/materials.data';
import { User } from '../users/entities/user.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Country, Language, User, Material],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const countryRepo = AppDataSource.getRepository(Country);
  const languageRepo = AppDataSource.getRepository(Language);
  const materialRepo = AppDataSource.getRepository(Material);


  for (const country of countries) {
    const exists = await countryRepo.findOne({ where: { code: country.code } });
    if (!exists) await countryRepo.save(country);
  }

  for (const language of languages) {
    const exists = await languageRepo.findOne({ where: { code: language.code } });
    if (!exists) await languageRepo.save(language);
  }

  const allLanguages = await languageRepo.find();

  for (const material of materials) {
    const language = allLanguages.find((lang) => lang.code === material.languageCode);
    if (!language) {
      console.warn(`Language not found for code: ${material.languageCode}`);
      continue;
    }
  
    const exists = await materialRepo.findOne({ where: { link: material.link } });
    if (!exists) {
      await materialRepo.save({
        ...material,
        language,
      });
    }
  }
  

  console.log('Countries, Languages and Materials seeded');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed error:', err);
});
