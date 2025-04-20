import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(dto: CreateLexemeDto): Promise<Lexeme> {
    const { lexeme, hubId } = dto;
    const hub = await this.hubService.findById(hubId);
    if (!hub) throw new NotFoundException('Hub not found');

    const entity = this.lexemeRepository.create({
      lexeme,
      hub,
    });

    return this.lexemeRepository.save(entity);
  }


  async findById(id: string): Promise<Lexeme> {
    const lexeme = await this.lexemeRepository.findOne({
      where: { id },
      relations: ['hub', 'definitions', 'examples', 'translations'],
    });
    if (!lexeme) throw new NotFoundException('Lexeme not found');
    return lexeme;
  }

  async findByHub(hubId: string): Promise<Lexeme[]> {
    return this.lexemeRepository.find({
      where: {
        hub: {
          id: hubId,
        },
      },
      relations: ['hub'], 
      order: { created_at: 'DESC' },
    });
  }

  async delete(id: string): Promise<void> {
    const result = await this.lexemeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Lexeme not found');
    }
  }
}
