import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lexeme } from './entities/lexeme.entity';
import { CreateLexemeDto } from './dto/create-lexeme.dto';
import { HubService } from 'src/hub/hub.service';

@Injectable()
export class LexemeService {
  constructor(
    @InjectRepository(Lexeme)
    private readonly lexemeRepository: Repository<Lexeme>,
    private readonly hubService: HubService,
  ) {}

  async create(createLexemeDto: CreateLexemeDto): Promise<Lexeme> {
    const { lexeme, sourceUrl, inputType, hubId } = createLexemeDto;

    const hub = await this.hubService.findById(hubId);
    if (!hub) {
      throw new Error(`Hub with ID ${hubId} not found`);
    }

    const lexemeEntity = this.lexemeRepository.create({
      lexeme,
      sourceUrl,
      inputType,
      hub,
    });

    return await this.lexemeRepository.save(lexemeEntity);
  }

  async findAll(): Promise<Lexeme[]> {
    return this.lexemeRepository.find({
      relations: ['hub'],
    });
  }

  async findOne(id: string): Promise<Lexeme> {
    return this.lexemeRepository.findOne({
      where: { id },
      relations: ['hub'],
    });
  }
}
