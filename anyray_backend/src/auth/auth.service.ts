import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Language } from '../languages/entities/language.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Language)
    private readonly languagesRepository: Repository<Language>,
  ) {}

  async signup(dto: SignupUserDto): Promise<{ id: string; email: string }> {
    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');
  
    const language = await this.languagesRepository.findOne({ where: { id: dto.translationLanguageId } });
    if (!language) throw new BadRequestException('Invalid translation language');
  
    const newUser = this.usersRepository.create({
      email: dto.email,
      password: dto.password,
      translationLanguage: language,
    });
  
    const savedUser = await this.usersRepository.save(newUser);
  
    return {
      id: savedUser.id,
      email: savedUser.email,
    };
  }
  

  async login(dto: LoginUserDto): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });

    // В реальности нужен bcrypt
    if (user && user.password === dto.password) {
      return user;
    }

    return null;
  }
}
