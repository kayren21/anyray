import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Language } from '../languages/entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Language])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
