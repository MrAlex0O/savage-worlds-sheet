// Маппинг между SQL-моделью и TypeScript-моделью Hindrance
import { Hindrance, Language } from '../../types/character';
import { SourceType } from '../../types/sourceType';

export interface HindranceDb {
  id: number | null;
  name: string;
  description: string;
  hindrance_type: 'Major' | 'Minor';
  source_id: SourceType;
  language: Language;
}

export function mapHindranceFromDb(db: HindranceDb): Hindrance {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    type: db.hindrance_type,
    sourceId: db.source_id,
    language: db.language,
  };
}

export function mapHindranceToDb(hindrance: Hindrance): HindranceDb {
  return {
    id: hindrance.id,
    name: hindrance.name,
    description: hindrance.description,
    hindrance_type: hindrance.type,
    source_id: hindrance.sourceId,
    language: hindrance.language,
  };
} 