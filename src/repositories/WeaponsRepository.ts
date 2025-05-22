import { Weapon, Language } from '../types/character';
import weaponsData from '../data/weapons.json';

export class WeaponsRepository {
  private static instance: WeaponsRepository;
  private weapons: Record<Language, Weapon[]>;

  private constructor() {
    this.weapons = weaponsData as Record<Language, Weapon[]>;
  }

  public static getInstance(): WeaponsRepository {
    if (!WeaponsRepository.instance) {
      WeaponsRepository.instance = new WeaponsRepository();
    }
    return WeaponsRepository.instance;
  }

  public getWeapons(language: Language): Weapon[] {
    return this.weapons[language];
  }

  public getWeaponByName(name: string, language: Language): Weapon | undefined {
    return this.weapons[language].find(weapon => weapon.name === name);
  }

  public getAllLanguages(): Language[] {
    return Object.keys(this.weapons) as Language[];
  }
} 