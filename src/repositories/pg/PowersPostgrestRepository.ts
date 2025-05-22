import { Power, Language } from '../../types/character';
import { fetchFromPostgrest } from './basePostgrestRepository';
import { mapPowerFromDb, PowerDb } from './powerMappers';

export class PowersPostgrestRepository {
  private static instance: PowersPostgrestRepository;

  private constructor() {}

  public static getInstance(): PowersPostgrestRepository {
    if (!PowersPostgrestRepository.instance) {
      PowersPostgrestRepository.instance = new PowersPostgrestRepository();
    }
    return PowersPostgrestRepository.instance;
  }

  public async getPowers(language: Language): Promise<Power[]> {
    const dbPowers = await fetchFromPostgrest<PowerDb>('powers', { language });
    return dbPowers.map(mapPowerFromDb);
  }

  public async getPowerByName(name: string, language: Language): Promise<Power | undefined> {
    const dbPowers = await fetchFromPostgrest<PowerDb>('powers', { name, language });
    return dbPowers.length > 0 ? mapPowerFromDb(dbPowers[0]) : undefined;
  }
} 