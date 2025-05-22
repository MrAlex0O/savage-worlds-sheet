import { Power, Language } from '../types/character';
import powersData from '../data/powers.json';

export class PowersRepository {
  private static instance: PowersRepository;
  private powers: Record<Language, Power[]>;

  private constructor() {
    this.powers = powersData as Record<Language, Power[]>;
  }

  public static getInstance(): PowersRepository {
    if (!PowersRepository.instance) {
      PowersRepository.instance = new PowersRepository();
    }
    return PowersRepository.instance;
  }

  public getPowers(language: Language): Power[] {
    return this.powers[language];
  }

  public getPowerByName(name: string, language: Language): Power | undefined {
    return this.powers[language].find(power => power.name === name);
  }

  public getAllLanguages(): Language[] {
    return Object.keys(this.powers) as Language[];
  }
} 