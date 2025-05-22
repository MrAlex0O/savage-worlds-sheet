import { Hindrance, Language } from '../../types/character';
import { fetchFromPostgrest } from './basePostgrestRepository';
import { mapHindranceFromDb, HindranceDb } from './hindranceMappers';

export class HindrancesPostgrestRepository {
  private static instance: HindrancesPostgrestRepository;

  private constructor() {}

  public static getInstance(): HindrancesPostgrestRepository {
    if (!HindrancesPostgrestRepository.instance) {
      HindrancesPostgrestRepository.instance = new HindrancesPostgrestRepository();
    }
    return HindrancesPostgrestRepository.instance;
  }

  public async getHindrances(language: Language): Promise<Hindrance[]> {
    const dbHindrances = await fetchFromPostgrest<HindranceDb>('hindrances', { language });
    return dbHindrances.map(mapHindranceFromDb);
  }

  public async getHindranceByName(name: string, language: Language): Promise<Hindrance | undefined> {
    const dbHindrances = await fetchFromPostgrest<HindranceDb>('hindrances', { name, language });
    return dbHindrances.length > 0 ? mapHindranceFromDb(dbHindrances[0]) : undefined;
  }
} 