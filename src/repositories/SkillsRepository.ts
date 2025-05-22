import { Skill } from '../types/character';
import skillsData from '../data/skills.json';
import { Language } from '../types/character';

export class SkillsRepository {
  private static instance: SkillsRepository;
  private skills: Record<Language, Skill[]>;

  private constructor() {
    this.skills = skillsData as Record<Language, Skill[]>;
  }

  public static getInstance(): SkillsRepository {
    if (!SkillsRepository.instance) {
      SkillsRepository.instance = new SkillsRepository();
    }
    return SkillsRepository.instance;
  }

  public getSkills(language: Language): Skill[] {
    return this.skills[language];
  }

  public getSkillByName(name: string, language: Language): Skill | undefined {
    return this.skills[language].find(skill => skill.name === name);
  }

  public getAllLanguages(): Language[] {
    return Object.keys(this.skills) as Language[];
  }
} 