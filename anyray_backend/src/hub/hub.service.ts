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
  
    const targetLanguage = await this.languageRepository.findOneByOrFail({
      id: target_language,
    });
  
    const user = await this.userRepository.findOneByOrFail({
      id: user_id,
    });
  
    const existingHubCount = await this.hubRepository.count({
      where: { user: { id: user_id } },
    });
  
    const newHub = this.hubRepository.create({
      targetLanguage,
      user,
      languageLevel: language_level,
      isDefault: existingHubCount === 0, 
    });
  
    return this.hubRepository.save(newHub);
  }
  
  

  async findById(id: string): Promise<Hub> {
    return this.hubRepository.findOne({
      where: { id },
      relations: ['targetLanguage', 'user'],
    });
  }

  async findDefaultByUser(userId: string): Promise<Hub | null> {
    return this.hubRepository
      .createQueryBuilder('hub')
      .leftJoinAndSelect('hub.user', 'user')
      .where('hub.is_default = true')
      .andWhere('user.id = :userId', { userId })
      .getOne();
  }  
}
