import { SourceType } from './sourceType';

export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12';
export type AttributeType = 'Agility' | 'Smarts' | 'Spirit' | 'Strength' | 'Vigor';
export type RankType = 'Novice' | 'Seasoned' | 'Veteran' | 'Heroic' | 'Legendary';
export type HindranceType = 'Major' | 'Minor';



export type Language = 'en' | 'ru';

export interface Attribute {
  id: number | null;
  die: DieType;
  modifier: number;
}

export interface Skill {
  id: number | null;
  name: string;
  die: DieType;
  modifier: number;
  linkedAttribute: AttributeType;
  sourceId: SourceType;
  sourcePage?: number;
  language: Language;
}

export interface Edge {
  id: number | null;
  name: string;
  description: string;
  sourceId: SourceType;
  sourcePage?: number;
  language: Language;
}

export interface Hindrance {
  id: number | null;  
  name: string;
  description: string;
  type: HindranceType;
  sourceId: SourceType;
  sourcePage?: number;
  language: Language;
}

export interface Gear {
  id: number | null;
  name: string;
  weight?: number;
  notes?: string;
  sourceId: SourceType;
  sourcePage?: number;
}

export interface Weapon {
  id: number | null;
  name: string;
  damage: string;
  range: string;
  ap: number;
  weight: number;
  notes: string;
  sourceId: SourceType;
  sourcePage?: number;
  language: Language;
}

export interface Power {
  id: number | null;
  name: string;
  powerPoints: number;
  range: string;
  duration: string;
  effect: string;
  sourceId: SourceType;
  sourcePage?: number;
  language: Language;
}

export interface DerivedStats {
  pace: number;
  parry: number;
  toughness: number;
  charisma: number;
}

export interface Character {
  id: number | null;
  name: string;
  race?: string;
  rank: RankType;
  experience: number;
  attributes: Record<AttributeType, Attribute>;
  skills: Skill[];
  derivedStats: DerivedStats;
  edges: Edge[];
  hindrances: Hindrance[];
  gear: Gear[];
  weapons: Weapon[];
  powers: Power[];
  wounds: number;
  fatigue: number;
  powerPoints: number;
  bennies: number;
} 