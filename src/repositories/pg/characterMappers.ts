// Маппинг между SQL-моделью и TypeScript-моделью Character
import { Character, Attribute, AttributeType, RankType, Language, HindranceType } from '../../types/character';
import { SourceType } from '../../types/sourceType';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

// Основная таблица персонажа
export interface CharacterDb {
  id: number | null;
  name: string;
  race?: string;
  rank: RankType;
  experience: number;
  pace: number;
  parry: number;
  toughness: number;
  charisma: number;
  wounds: number;
  fatigue: number;
  bennies: number;
  power_points: number;
  created_at?: string;
  updated_at?: string;
  // Вложенные сущности:
  attributes: CharacterAttributeDTO[];
  skills: CharacterSkillDTO[];
  edges: CharacterEdgeDTO[];
  hindrances: CharacterHindranceDTO[];
  gear: CharacterGearDTO[];
  weapons: CharacterWeaponDTO[];
  powers: CharacterPowerDTO[];
}

export interface CharacterAttributeDTO {
  id: number | null;
  attribute: AttributeType;
  die: string;
  modifier: number;
}
export interface CharacterSkillDTO {
  id: number | null;
  name: string;
  die: string;
  modifier: number;
  linked_attribute: AttributeType;
}
export interface CharacterEdgeDTO {
  id: number | null;
  name: string;
  description: string;
  source_id: SourceType;
  source_page?: number;
  language: Language;
}
export interface CharacterHindranceDTO {
  id: number | null;
  name: string;
  hindrance_type: HindranceType;
  description: string;
  source_id: SourceType;
  source_page?: number;
  language: Language;
}
export interface CharacterGearDTO {
  id: number | null;
  name: string;
  weight?: number;
  notes?: string;
  source_id: SourceType;
  source_page?: number;
}
export interface CharacterWeaponDTO {
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
export interface CharacterPowerDTO {
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

export function mapCharacterFromDb(db: CharacterDb): Character {
  return {
    id: db.id,
    name: db.name,
    race: db.race,
    rank: db.rank,
    experience: db.experience,
    attributes: db.attributes.reduce((acc, attr) => {
      acc[attr.attribute] = { id: attr.id, die: attr.die as any, modifier: attr.modifier };
      return acc;
    }, {} as Record<AttributeType, Attribute>),
    skills: db.skills.map(s => ({
      id: s.id,
      name: s.name,
      die: s.die as any,
      modifier: s.modifier,
      linkedAttribute: s.linked_attribute,
      sourceId: 'CUSTOM',
      language: 'en',
    })),
    derivedStats: {
      pace: db.pace,
      parry: db.parry,
      toughness: db.toughness,
      charisma: db.charisma,
    },
    edges: db.edges.map(e => ({
      id: e.id,
      name: e.name,
      description: e.description,
      sourceId: e.source_id,
      language: e.language,
    })),
    hindrances: db.hindrances.map(h => ({
      id: h.id,
      name: h.name,
      description: h.description,
      type: h.hindrance_type,
      sourceId: h.source_id,
      language: h.language,
    })),
    gear: db.gear.map(g => ({
      id: g.id,
      name: g.name,
      weight: g.weight,
      notes: g.notes,
      sourceId: g.source_id,
      sourcePage: g.source_page,
    })),
    weapons: db.weapons.map(w => ({
      id: w.id,
      name: w.name,
      damage: w.damage,
      range: w.range,
      ap: w.ap,
      weight: w.weight,
      notes: w.notes,
      sourceId: w.source_id,
      sourcePage: w.source_page,
      language: w.language,
    })),
    powers: db.powers.map(p => ({
      id: p.id,
      name: p.name,
      powerPoints: p.power_points,
      range: p.range,
      duration: p.duration,
      effect: p.effect,
      sourceId: p.source_id,
      sourcePage: p.source_page,
      language: p.language,
    })),
    wounds: db.wounds,
    fatigue: db.fatigue,
    powerPoints: db.power_points,
    bennies: db.bennies,
  };
}

export function mapCharacterToDb(character: Character): CharacterDb {
  return {
    id: character.id, // id должен быть установлен отдельно, если нужно
    name: character.name,
    race: character.race,
    rank: character.rank,
    experience: character.experience,
    pace: character.derivedStats.pace,
    parry: character.derivedStats.parry,
    toughness: character.derivedStats.toughness,
    charisma: character.derivedStats.charisma,
    wounds: character.wounds,
    fatigue: character.fatigue,
    bennies: character.bennies,
    power_points: character.powerPoints,
    attributes: Object.entries(character.attributes).map(([attribute, value]) => ({
      id: value.id,
      attribute: attribute as AttributeType,
      die: value.die,
      modifier: value.modifier,
    })),
    skills: character.skills.map(s => ({
      id: s.id ?? null,
      name: s.name,
      die: s.die,
      modifier: s.modifier,
      linked_attribute: s.linkedAttribute,
    })),
    edges: character.edges.map(e => ({
      id: e.id ?? null,
      name: e.name,
      description: e.description,
      source_id: e.sourceId,
      source_page: e.sourcePage,
      language: e.language,
    })),
    hindrances: character.hindrances.map(h => ({
      id: h.id ?? null,
      name: h.name,
      hindrance_type: h.type,
      description: h.description,
      source_id: h.sourceId,
      source_page: h.sourcePage,
      language: h.language,
    })),
    gear: character.gear.map(g => ({
      id: g.id,
      name: g.name,
      weight: g.weight,
      notes: g.notes,
      source_id: g.sourceId,
      source_page: g.sourcePage,
    })),
    weapons: character.weapons.map(w => ({
      id: w.id,
      name: w.name,
      damage: w.damage,
      range: w.range,
      ap: w.ap,
      weight: w.weight,
      notes: w.notes,
      source_id: w.sourceId,
      source_page: w.sourcePage,
      language: w.language,
    })),
    powers: character.powers.map(p => ({
      id: p.id,
      name: p.name,
      power_points: p.powerPoints,
      range: p.range,
      duration: p.duration,
      effect: p.effect,
      source_id: p.sourceId,
      source_page: p.sourcePage,
      language: p.language,
    })),
  };
} 