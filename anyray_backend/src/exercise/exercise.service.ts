import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise, ExerciseType } from './entities/exercise.entity';
import { Lexeme } from 'src/lexeme/entities/lexeme.entity';
import { Translation } from 'src/translation/entities/translation.entity';
import { Definition } from 'src/definition/entities/definition.entity';


@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,

    @InjectRepository(Lexeme)
    private readonly lexemeRepo: Repository<Lexeme>,

    @InjectRepository(Translation)
    private readonly translationRepo: Repository<Translation>,

    @InjectRepository(Definition)
    private readonly definitionRepo: Repository<Definition>,
  ) {}

  private shuffleArray(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  async generateTranslationExercise(lexemeId: string): Promise<Exercise> {
    const lexeme = await this.lexemeRepo.findOne({
      where: { id: lexemeId },
      relations: ['hub'],
    });
    if (!lexeme) throw new Error('Lexeme not found');

    const translations = await this.translationRepo.find({
      where: { lexeme: { id: lexemeId } },
    });
    if (translations.length === 0) throw new Error('No translations found');

    const distractors = await this.translationRepo
      .createQueryBuilder('translation')
      .innerJoin('translation.lexeme', 'lexeme')
      .where('lexeme.hub_id = :hubId', { hubId: lexeme.hub.id })
      .andWhere('lexeme.id != :lexemeId', { lexemeId })
      .orderBy('RANDOM()')
      .limit(2)
      .getMany();
    if (distractors.length < 2) throw new Error('Not enough distractors');

    const exercise = this.exerciseRepo.create({
      lexeme,
      type: ExerciseType.MULTIPLE_CHOICE_TRANSLATION,
    });

    return this.exerciseRepo.save(exercise);
  }

  async generateDefinitionExercise(lexemeId: string): Promise<Exercise> {
    const lexeme = await this.lexemeRepo.findOne({
      where: { id: lexemeId },
      relations: ['hub'],
    });
    if (!lexeme) throw new Error('Lexeme not found');

    const definitions = await this.definitionRepo.find({
      where: { lexeme: { id: lexemeId } },
    });
    if (definitions.length === 0) throw new Error('No definitions found');

    const distractors = await this.definitionRepo
      .createQueryBuilder('definition')
      .innerJoin('definition.lexeme', 'lexeme')
      .where('lexeme.hub_id = :hubId', { hubId: lexeme.hub.id })
      .andWhere('lexeme.id != :lexemeId', { lexemeId })
      .orderBy('RANDOM()')
      .limit(2)
      .getMany();
    if (distractors.length < 2) throw new Error('Not enough distractors');

    const exercise = this.exerciseRepo.create({
      lexeme,
      type: ExerciseType.MULTIPLE_CHOICE_DEFINITION,
    });

    return this.exerciseRepo.save(exercise);
  }

  async generateAllAvailableExercises(hubId: string): Promise<{ created: number; skipped: number }> {
    const lexemes = await this.lexemeRepo.find({ where: { hub: { id: hubId } } });

    let created = 0;
    let skipped = 0;

    for (const lexeme of lexemes) {
      try {
        await this.generateTranslationExercise(lexeme.id);
        created++;
      } catch {
        skipped++;
      }

      try {
        await this.generateDefinitionExercise(lexeme.id);
        created++;
      } catch {
        skipped++;
      }
    }

    return { created, skipped };
  }

  

  async createExercise(lexemeId: string, type: ExerciseType): Promise<Exercise> {
    const lexeme = await this.lexemeRepo.findOneByOrFail({ id: lexemeId });
    const exercise = this.exerciseRepo.create({ lexeme, type });
    return this.exerciseRepo.save(exercise);
  }

  async generateQuizzesByLexeme(lexemeId: string) {
    const exercises = await this.exerciseRepo.find({
      where: { lexeme: { id: lexemeId } },
      relations: ['lexeme', 'lexeme.hub'],
    });
  
    if (!exercises.length) {
      throw new Error('No exercises found for this word.');
    }
  
    const quizzes = [];
  
    for (const exercise of exercises) {
      const hubId = exercise.lexeme.hub.id;
      const lexemeId = exercise.lexeme.id;
      const lexemeText = exercise.lexeme.lexeme;
  
      const DISTRACTOR_LIMIT = 5;
      const FINAL_OPTIONS_COUNT = 4;
  
      if (exercise.type === ExerciseType.MULTIPLE_CHOICE_TRANSLATION) {
        const correctTranslation = await this.translationRepo.findOne({
          where: { lexeme: { id: lexemeId } },
        });
  
        if (!correctTranslation) continue;
  
        const distractors = await this.translationRepo
          .createQueryBuilder('translation')
          .innerJoin('translation.lexeme', 'lexeme')
          .where('lexeme.hub_id = :hubId', { hubId })
          .andWhere('lexeme.id != :lexemeId', { lexemeId })
          .orderBy('RANDOM()')
          .limit(DISTRACTOR_LIMIT)
          .getMany();
  
        const optionsSet = new Set<string>();
        optionsSet.add(correctTranslation.translation);
  
        for (const distractor of distractors) {
          if (!optionsSet.has(distractor.translation)) {
            optionsSet.add(distractor.translation);
          }
          if (optionsSet.size >= FINAL_OPTIONS_COUNT) break;
        }
  
        quizzes.push({
          question: `What is the translation of "${lexemeText}"?`,
          options: this.shuffleArray(Array.from(optionsSet)),
          correctAnswer: correctTranslation.translation,
        });
      }
  
      if (exercise.type === ExerciseType.MULTIPLE_CHOICE_DEFINITION) {
        const correctDefinition = await this.definitionRepo.findOne({
          where: { lexeme: { id: lexemeId } },
        });
  
        if (!correctDefinition) continue;
  
        const distractors = await this.definitionRepo
          .createQueryBuilder('definition')
          .innerJoin('definition.lexeme', 'lexeme')
          .where('lexeme.hub_id = :hubId', { hubId })
          .andWhere('lexeme.id != :lexemeId', { lexemeId })
          .orderBy('RANDOM()')
          .limit(DISTRACTOR_LIMIT)
          .getMany();
  
        const optionsSet = new Set<string>();
        optionsSet.add(correctDefinition.definition);
  
        for (const distractor of distractors) {
          if (!optionsSet.has(distractor.definition)) {
            optionsSet.add(distractor.definition);
          }
          if (optionsSet.size >= FINAL_OPTIONS_COUNT) break;
        }
  
        quizzes.push({
          question: `What is the definition of "${lexemeText}"?`,
          options: this.shuffleArray(Array.from(optionsSet)),
          correctAnswer: correctDefinition.definition,
        });
      }
    }
  
    if (!quizzes.length) {
      throw new Error('No valid quizzes generated for this word.');
    }
  
    return quizzes;
  }
  
  
}
