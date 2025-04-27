import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ExerciseStatus, Lexeme } from './entities/lexeme.entity';
import { CreateLexemeDto } from './dto/create-lexeme.dto';
import { HubService } from 'src/hub/hub.service';
import { differenceInDays, startOfWeek, formatISO } from 'date-fns'; 
import { ExerciseService } from 'src/exercise/exercise.service';

@Injectable()
export class LexemeService {
  constructor(
    @InjectRepository(Lexeme)
    private readonly lexemeRepository: Repository<Lexeme>,
    private readonly hubService: HubService,
    private readonly exerciseService: ExerciseService, 
  ) {}

  async create(dto: CreateLexemeDto): Promise<Lexeme> {
    const { lexeme, hubId } = dto;
    const hub = await this.hubService.findById(hubId);
    if (!hub) throw new NotFoundException('Hub not found');
  
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    const entity = this.lexemeRepository.create({
      lexeme,
      hub,
      easeFactor: 2.5,
      repetitionCount: 0,
      correctStreak: 0,
      lastReview: null,
      nextReview: tomorrow,
      masteredAt: null,
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

  async updateAfterReview(lexemeId: string, quality: number): Promise<Lexeme> {
    const lexeme = await this.lexemeRepository.findOneByOrFail({ id: lexemeId });
  
    if (![1, 3, 5].includes(quality)) {
      throw new Error('Invalid quality score. Allowed values: 1 (wrong), 3 (hard), 5 (easy)');
    }
  
    const now = new Date();
    const intervals = [1, 2, 4, 7, 14, 30, 60, 120, 180];
  
    if (lexeme.repetitionCount == null) lexeme.repetitionCount = 0;
    if (lexeme.correctStreak == null) lexeme.correctStreak = 0;
    if (lexeme.easeFactor == null) lexeme.easeFactor = 2.5; // стартовый коэффициент
  
    let intervalDays = 1;
  
    if (quality === 5) {
      // правильный ответ
      lexeme.correctStreak += 1;
      lexeme.repetitionCount += 1;
  
      if (lexeme.correctStreak <= intervals.length) {
        intervalDays = intervals[lexeme.correctStreak - 1];
      } else {
        intervalDays = intervals[intervals.length - 1];
      }
  
      // если streak >= 3 — boost
      if (lexeme.correctStreak >= 3) {
        intervalDays = Math.round(intervalDays * 1.5);
        lexeme.easeFactor = Math.min(lexeme.easeFactor + 0.15, 3.0); // бустируем лёгкость
      }
    } else if (quality === 3) {
      // правильный ответ, но с задержкой
      lexeme.correctStreak += 1;
      lexeme.repetitionCount += 1;
  
      if (lexeme.correctStreak <= intervals.length) {
        intervalDays = intervals[lexeme.correctStreak - 1];
      } else {
        intervalDays = intervals[intervals.length - 1];
      }
  
      // но без буста коэффициента
    } else {
      // неправильный ответ
      lexeme.correctStreak = Math.max(0, lexeme.correctStreak - 2);
      intervalDays = 1; // снова повторить завтра
      lexeme.easeFactor = Math.max(1.3, lexeme.easeFactor - 0.2); // маленький штраф
    }
  
    lexeme.lastReview = now;
    lexeme.nextReview = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  
    // статусы
    if (lexeme.correctStreak >= 8) {
      lexeme.status = ExerciseStatus.MASTERED;
      lexeme.masteredAt = now;
    } else if (lexeme.correctStreak >= 3) {
      lexeme.status = ExerciseStatus.REVIEW;
      lexeme.masteredAt = null;
    } else {
      lexeme.status = ExerciseStatus.LEARNING;
      lexeme.masteredAt = null;
    }
  
    return this.lexemeRepository.save(lexeme);
  }
  
  

  async getLexemesForToday(hubId: string): Promise<Lexeme[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return this.lexemeRepository.find({
      where: {
        nextReview: Between(today, tomorrow),
        hub: { id: hubId },
      },
      relations: ['hub'],
    });
  }

  async getMasteredWordsStatsByHub(hubId: string): Promise<{
    masteredWordsByWeek: { week: string; count: number }[];
    totalMastered: number;
    averageDaysToMaster: number | null;
  }> {
    const masteredLexemes = await this.lexemeRepository.find({
      where: {
        masteredAt: Between(new Date('2000-01-01'), new Date()), // все, у кого masteredAt не null
        hub: { id: hubId },
      },
      relations: ['hub'],
    });

    const weekCounts: { [weekStart: string]: number } = {};
    let totalDays = 0;
    let countWithDates = 0;

    for (const lexeme of masteredLexemes) {
      if (lexeme.masteredAt && lexeme.created_at) {
        const weekStart = formatISO(startOfWeek(lexeme.masteredAt, { weekStartsOn: 1 })).slice(0, 10);

        if (!weekCounts[weekStart]) {
          weekCounts[weekStart] = 0;
        }
        weekCounts[weekStart] += 1;

        const days = differenceInDays(lexeme.masteredAt, lexeme.created_at);
        totalDays += days;
        countWithDates += 1;
      }
    }

    const masteredWordsByWeek = Object.entries(weekCounts).map(([week, count]) => ({ week, count }));

    return {
      masteredWordsByWeek,
      totalMastered: masteredLexemes.length,
      averageDaysToMaster: countWithDates > 0 ? Math.round(totalDays / countWithDates) : null,
    };
  }

  

}
