import { Character } from '../../types/character';
import { fetchFromPostgrest, postToPostgrest } from './basePostgrestRepository';
import { CharacterAttributeDTO, CharacterEdgeDTO, CharacterGearDTO, CharacterPowerDTO, CharacterSkillDTO, CharacterHindranceDTO, CharacterWeaponDTO, mapCharacterFromDb, mapCharacterToDb } from './characterMappers';
import { CharacterDb as CharacterDTO } from './characterMappers';

export class CharacterPostgrestRepository {
  private static instance: CharacterPostgrestRepository;

  private constructor() {}

  public static getInstance(): CharacterPostgrestRepository {
    if (!CharacterPostgrestRepository.instance) {
      CharacterPostgrestRepository.instance = new CharacterPostgrestRepository();
    }
    return CharacterPostgrestRepository.instance;
  }

  public async getCharacterById(id: number): Promise<Character | undefined> {
    // 1. Получаем основную запись
    const mainArr = await fetchFromPostgrest<CharacterDTO>('characters', { id });
    if (!mainArr.length) return undefined;
    const main = mainArr[0];
    // 2. Получаем вложенные сущности
    const [attributes, skills, edges, hindrances, gear, weapons, powers] = await Promise.all([
      fetchFromPostgrest<CharacterAttributeDTO>('character_attributes', { character_id: id }),
      fetchFromPostgrest<CharacterSkillDTO>('character_skills', { character_id: id }),
      fetchFromPostgrest<CharacterEdgeDTO>('character_edges', { character_id: id }),
      fetchFromPostgrest<CharacterHindranceDTO>('character_hindrances', { character_id: id }),
      fetchFromPostgrest<CharacterGearDTO>('character_gear', { character_id: id }),
      fetchFromPostgrest<CharacterWeaponDTO>('character_weapons', { character_id: id }),
      fetchFromPostgrest<CharacterPowerDTO>('character_powers', { character_id: id }),
    ]);
    // 3. Собираем объект для маппинга
    const dbChar = {
      ...main,
      attributes,
      skills,
      edges,
      hindrances,
      gear,
      weapons,
      powers,
    };
    return mapCharacterFromDb(dbChar);
  }

  public async saveCharacter(character: Character): Promise<any> {
    // 1. Сохраняем основную таблицу персонажа
    const dbChar = mapCharacterToDb(character);
    // Удаляем вложенные сущности для основного запроса
    const { attributes, skills, edges, hindrances, gear, weapons, powers, ...mainChar } = dbChar;
    // POST основной объект
    const [created] = await postToPostgrest('characters', mainChar, mainChar.id != null ? `id=eq.${mainChar.id}` : '',
      mainChar.id != null ? 'resolution=merge-duplicates' : 'return=representation'
    );
    const characterId = created.id;
    // 2. Сохраняем вложенные сущности отдельными запросами
    if (attributes?.length)
        await Promise.all(attributes.map(attr =>
          postToPostgrest(
            'character_attributes',
            { ...attr, character_id: characterId }, 
            attr.id != null ? `id=eq.${attr.id}` : '',
            attr.id != null ? 'resolution=merge-duplicates' : 'return=representation'
          )
        ));
      
      if (skills?.length)
        await Promise.all(skills.map(skill =>
          postToPostgrest(
            'character_skills',
            { ...skill, character_id: characterId }, 
            skill.id != null ? `id=eq.${skill.id}` : '',
            skill.id != null ? 'resolution=merge-duplicates' : 'return=representation'
            )
        ));
      
      if (edges?.length)
        await Promise.all(edges.map(edge =>
          postToPostgrest(
            'character_edges',
            { ...edge, character_id: characterId }, 
            edge.id != null ? `id=eq.${edge.id}` : '',
            edge.id != null ? 'resolution=merge-duplicates' : 'return=representation'
          )
        ));
      
      if (hindrances?.length)
        await Promise.all(hindrances.map(h =>
          postToPostgrest(
            'character_hindrances',
            { ...h, character_id: characterId }, 
            h.id != null ? `id=eq.${h.id}` : '',
            h.id != null ? 'resolution=merge-duplicates' : 'return=representation'
          )
        ));
      
      if (gear?.length)
        await Promise.all(gear.map(g =>
          postToPostgrest(
            'character_gear',
            { ...g, character_id: characterId }, 
            g.id != null ? `id=eq.${g.id}` : '',
            g.id != null ? 'resolution=merge-duplicates' : 'return=representation'
          )
        ));
      
      if (weapons?.length)
        await Promise.all(weapons.map(w =>
          postToPostgrest(
            'character_weapons',
            { ...w, character_id: characterId }, 
            w.id != null ? `id=eq.${w.id}` : '',
            w.id != null ? 'resolution=merge-duplicates' : 'return=representation'
          )
        ));
      
      if (powers?.length)
        await Promise.all(powers.map(p =>
          postToPostgrest(
            'character_powers',
            { ...p, character_id: characterId }, 
            p.id != null ? `id=eq.${p.id}` : '',
            p.id != null ? 'resolution=merge-duplicates' : 'return=representation'
          )
        ));
      
    return characterId;
  }

  // Для сохранения потребуется mapCharacterToDb и отдельный endpoint
} 