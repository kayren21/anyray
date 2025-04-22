import { LanguageLevel, MaterialType } from '../../materials/entities/material.entity';

export const materials = [
  {
    link: 'https://breakingnewsenglish.com',
    description: 'Breaking News English - A site with news articles for different levels',
    material_type: MaterialType.ARTICLE,
    language_level: LanguageLevel.BEGINNER,
    languageCode: 'en',
  },
  {
    link: 'https://youglish.com/',
    description: 'YouGlish - A site to practice listening with YouTube videos',
    material_type: MaterialType.VIDEO,
    language_level: LanguageLevel.INTERMEDIATE,
    languageCode: 'en',
  },
  {
    link: 'https://mini-ielts.com/1518/reading/australian-artist-margaret-preston',
    description: 'Australian Artist Margaret Preston - A reading article for IELTS practice',
    material_type: MaterialType.ARTICLE,
    language_level: LanguageLevel.ADVANCED,
    languageCode: 'en',
  },
  {
    link: 'https://youtu.be/8nXX1WOuvrk?si=pOmCzeJyIU47Ih5o',
    description: 'English Level Test - A video to test your English level',
    material_type: MaterialType.VIDEO,
    language_level: LanguageLevel.ALL,
    languageCode: 'en',
  },
  {
    link: 'https://youtu.be/jXvzisWe8PA?si=DeaDSaTmd3nDh1L-',
    description: 'How to Get a Band 9 in IELTS Academic Writing Task 1 (Bar Chart)',
    material_type: MaterialType.VIDEO,
    language_level: LanguageLevel.ADVANCED,
    languageCode: 'en',
  }
];
