import { Weapon, Language } from '../../types/character';
import { fetchFromPostgrest } from './basePostgrestRepository';
import { mapWeaponFromDb, WeaponDb } from './weaponMappers';

export class WeaponsPostgrestRepository {
  private static instance: WeaponsPostgrestRepository;

  private constructor() {}

  public static getInstance(): WeaponsPostgrestRepository {
    if (!WeaponsPostgrestRepository.instance) {
      WeaponsPostgrestRepository.instance = new WeaponsPostgrestRepository();
    }
    return WeaponsPostgrestRepository.instance;
  }

  public async getWeapons(language: Language): Promise<Weapon[]> {
    const dbWeapons = await fetchFromPostgrest<WeaponDb>('weapons', { language });
    return dbWeapons.map(mapWeaponFromDb);
  }

  public async getWeaponByName(name: string, language: Language): Promise<Weapon | undefined> {
    const dbWeapons = await fetchFromPostgrest<WeaponDb>('weapons', { name, language });
    return dbWeapons.length > 0 ? mapWeaponFromDb(dbWeapons[0]) : undefined;
  }
} 