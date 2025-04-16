import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Country } from '../countries/entities/country.entity'; // Import Country entity
import { Language } from '../languages/entities/language.entity'; // Import Language entity
import { CountriesModule } from '../countries/countries.module'; // Import the CountriesModule
import { LanguagesModule } from '../languages/languages.module'; // Import the LanguagesModule
import { Hub } from 'src/hub/entities/hub.entity';
import { HubModule } from 'src/hub/hub.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Country, Language, Hub]), // Include the necessary entities
    CountriesModule, // Import CountriesModule to access CountryRepository
    LanguagesModule, // Import LanguagesModule to access LanguageRepository
    HubModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
