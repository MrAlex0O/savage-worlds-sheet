// Маппинг между SQL-моделью и TypeScript-моделью Power
import { Power, Language } from '../../types/character';
import { SourceType } from '../../types/sourceType';

// Тип для строки из базы данных (PostgREST)
export interface PowerDb {
  id: number | null;
  name: string;
  power_points: number;
  range: string;
  duration: string;
  effect: string;
  source_id: SourceType;
  source_page?: number;
  language: Language;
}

// Маппинг из PowerDb (snake_case) в Power (camelCase)
export function mapPowerFromDb(db: PowerDb): Power {
  return {
    id: db.id,
    name: db.name,
    powerPoints: db.power_points,
    range: db.range,
    duration: db.duration,
    effect: db.effect,
    sourceId: db.source_id,
    sourcePage: db.source_page,
    language: db.language,
  };
}

// Маппинг из Power (camelCase) в PowerDb (snake_case)
export function mapPowerToDb(power: Power): PowerDb {
  return {
    id: power.id,
    name: power.name,
    power_points: power.powerPoints,
    range: power.range,
    duration: power.duration,
    effect: power.effect,
    source_id: power.sourceId,
    source_page: power.sourcePage,
    language: power.language,
  };
} 