// Маппинг между SQL-моделью и TypeScript-моделью Weapon
import { Weapon, Language} from '../../types/character';
import { SourceType } from '../../types/sourceType';

// Тип для строки из базы данных (PostgREST)
export interface WeaponDb {
  id: number | null;
  name: string;
  damage: string;
  range: string;
  ap: number;
  weight: number;
  notes: string;
  source_id: SourceType;
  source_page?: number;
  language: Language;
}

// Маппинг из WeaponDb (snake_case) в Weapon (camelCase)
export function mapWeaponFromDb(db: WeaponDb): Weapon {
  return {
    id: db.id,
    name: db.name,
    damage: db.damage,
    range: db.range,
    ap: db.ap,
    weight: db.weight,
    notes: db.notes,
    sourceId: db.source_id,
    sourcePage: db.source_page,
    language: db.language,
  };
}

// Маппинг из Weapon (camelCase) в WeaponDb (snake_case)
export function mapWeaponToDb(weapon: Weapon): WeaponDb {
  return {
    id: weapon.id,
    name: weapon.name,
    damage: weapon.damage,
    range: weapon.range,
    ap: weapon.ap,
    weight: weapon.weight,
    notes: weapon.notes,
    source_id: weapon.sourceId,
    source_page: weapon.sourcePage,
    language: weapon.language,
  };
} 