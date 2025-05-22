// Маппинг между SQL-моделью и TypeScript-моделью Edge
import { Edge, Language } from '../../types/character';
import { SourceType } from '../../types/sourceType';

export interface EdgeDb {
  id: number | null;
  name: string;
  description: string;
  source_id: SourceType;
  language: Language;
}

export function mapEdgeFromDb(db: EdgeDb): Edge {
  return {
    id: db.id ?? null,
    name: db.name,
    description: db.description,
    sourceId: db.source_id,
    language: db.language,
  };
}

export function mapEdgeToDb(edge: Edge): EdgeDb {
  return {
    id: edge.id ?? null,
    name: edge.name,
    description: edge.description,
    source_id: edge.sourceId,
    language: edge.language,
  };
} 