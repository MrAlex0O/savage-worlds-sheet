import { Skill, Language } from '../../types/character';
import { fetchFromPostgrest } from './basePostgrestRepository';

export class SkillsPostgrestRepository {
  private static instance: SkillsPostgrestRepository;

  private constructor() {}

  public static getInstance(): SkillsPostgrestRepository {
    if (!SkillsPostgrestRepository.instance) {
      SkillsPostgrestRepository.instance = new SkillsPostgrestRepository();
    }
    return SkillsPostgrestRepository.instance;
  }

  public async getSkills(language: Language): Promise<Skill[]> {
    return fetchFromPostgrest<Skill>('skills', { language });
  }

  public async getSkillByName(name: string, language: Language): Promise<Skill | undefined> {
    const skills = await fetchFromPostgrest<Skill>('skills', { name, language });
    return skills[0];
  }
} 