import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hub } from './entities/hub.entity';
import { CreateHubDto } from './dto/create-hub.dto';
import { Language } from 'src/languages/entities/language.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class HubService {
  constructor(
    @InjectRepository(Hub)
    private readonly hubRepository: Repository<Hub>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createHubDto: CreateHubDto): Promise<Hub> {
    const { target_language, user_id, language_level } = createHubDto;

    // Find related entities
    const targetLanguage = await this.languageRepository.findOneByOrFail({
      id: target_language, // Ensure the type matches `Language.id` (number)
    });

    const user = await this.userRepository.findOneByOrFail({
      id: user_id, // Ensure the type matches `User.id` (number)
    });

    // Create new Hub entity
    const newHub = this.hubRepository.create({
      targetLanguage, // Property name matches the `Hub` entity
      user, // Property name matches the `Hub` entity
      languageLevel: language_level, // Map to `Hub` entity field
    });

    // Save and return the newly created Hub
    return this.hubRepository.save(newHub);
  }

  async findById(id: string): Promise<Hub> {
    return this.hubRepository.findOne({
      where: { id },
      relations: ['targetLanguage', 'user'],
    });
  }
}
