import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { Language } from '../languages/entities/language.entity';
import { Material } from '../materials/entities/material.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Material, Language])],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [TypeOrmModule],
})
export class MaterialsModule {}
