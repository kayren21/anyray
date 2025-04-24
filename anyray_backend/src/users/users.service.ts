import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Country } from '../countries/entities/country.entity';
import { Language } from '../languages/entities/language.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HubService } from '../hub/hub.service';
import { CreateHubDto } from '../hub/dto/create-hub.dto';
import { LanguageLevel } from '../hub/entities/hub.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,

    @InjectRepository(Language)
    private readonly languagesRepository: Repository<Language>,

    private readonly hubService: HubService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Validate related entities
    const country = await this.countriesRepository.findOne({
      where: { id: createUserDto.homeLandId },
    });
    if (!country) {
      throw new Error(`Invalid homeLandId: ${createUserDto.homeLandId}`);
    }

    const language = await this.languagesRepository.findOne({
      where: { id: createUserDto.translationLanguageId },
    });
    if (!language) {
      throw new Error(
        `Invalid translationLanguageId: ${createUserDto.translationLanguageId}`,
      );
    }

    // Create the User
    const user = this.usersRepository.create({
      ...createUserDto,
      homeLandId: country,
      translationLanguage: language,
    });

    const savedUser = await this.usersRepository.save(user);

    // Automatically create a Hub for the user
    const createHubDto: CreateHubDto = {
      target_language: language.id.toString(), // Ensure IDs are strings
      user_id: savedUser.id.toString(),
      language_level: LanguageLevel.BEGINNER,
    };

    // Call HubService to create the hub
    await this.hubService.create(createHubDto);

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: ['homeLandId', 'translationLanguage'],
    });
  }

  async findOne(id: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['homeLandId', 'translationLanguage'],
    });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
  
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
  
    await this.usersRepository.remove(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (updateUserDto.password) {
      if (!updateUserDto.currentPassword) {
        throw new BadRequestException('Current password is required to change the password');
      }
  
      if (updateUserDto.currentPassword !== user.password) {
        throw new BadRequestException('Current password is incorrect');
      }
  
      user.password = updateUserDto.password;
    }
  
    user.firstName = updateUserDto.firstName ?? user.firstName;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.gender = updateUserDto.gender ?? user.gender;
    user.dob = updateUserDto.dob ?? user.dob;
  
    if (updateUserDto.translationLanguageId) {
      const lang = await this.languagesRepository.findOneBy({ id: updateUserDto.translationLanguageId });
      if (!lang) throw new NotFoundException('Translation language not found');
      user.translationLanguage = lang;
    }
  
    if (updateUserDto.homeLandId) {
      const country = await this.countriesRepository.findOneBy({ id: updateUserDto.homeLandId });
      if (!country) throw new NotFoundException('Country not found');
      user.homeLandId = country;
    }
  
    return this.usersRepository.save(user);
  }
  
  
}
