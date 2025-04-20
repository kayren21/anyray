import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Country } from '../countries/entities/country.entity'; 
import { Language } from '../languages/entities/language.entity'; 
import { CountriesModule } from '../countries/countries.module'; 
import { LanguagesModule } from '../languages/languages.module'; 
import { Hub } from 'src/hub/entities/hub.entity';
import { HubModule } from 'src/hub/hub.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Country, Language, Hub]), 
    CountriesModule, 
    LanguagesModule, 
    HubModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
