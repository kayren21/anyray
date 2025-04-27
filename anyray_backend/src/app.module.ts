import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { LanguagesModule } from './languages/languages.module';
import { MaterialsModule } from './materials/materials.module';
import { CountriesModule } from './countries/countries.module';
import { HubModule } from './hub/hub.module';
import { LexemeModule } from './lexeme/lexeme.module';
import { DefinitionModule } from './definition/definition.module';
import { AuthModule } from './auth/auth.module';
import { ExampleModule } from './example/example.module';
import { TranslationModule } from './translation/translation.module';
import { ExerciseModule } from './exercise/exercise.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, //Set to true in dev mode to auto-create tables
      }),
    }),
    UsersModule,
    LanguagesModule,
    CountriesModule,
    HubModule,
    LexemeModule,
    MaterialsModule,
    DefinitionModule,
    AuthModule,
    ExampleModule,
    TranslationModule,
    ExerciseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
