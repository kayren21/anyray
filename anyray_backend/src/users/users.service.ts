import { Injectable } from '@nestjs/common';
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

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneByOrFail({ id });
  
    if (updateDto.homeLandId) {
      const country = await this.countriesRepository.findOneByOrFail({ id: updateDto.homeLandId });
      user.homeLandId = country;
    }
  
    if (updateDto.translationLanguageId) {
      const language = await this.languagesRepository.findOneByOrFail({ id: updateDto.translationLanguageId });
      user.translationLanguage = language;
    }
  

    if (updateDto.firstName !== undefined) user.firstName = updateDto.firstName;
    if (updateDto.lastName !== undefined) user.lastName = updateDto.lastName;
    if (updateDto.gender !== undefined) user.gender = updateDto.gender;
    if (updateDto.dob !== undefined) user.dob = updateDto.dob;
  
    return this.usersRepository.save(user);
  }
  
  
}
