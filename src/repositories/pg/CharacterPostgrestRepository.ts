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
    const [created] = await postToPostgrest('characters', mainChar  );
    const characterId = created.id;
    // 2. Сохраняем вложенные сущности отдельными запросами
    if (attributes?.length)
        await Promise.all(attributes.map(attr =>
          postToPostgrest(
            'character_attributes',
            { ...attr, character_id: characterId }, 
          )
        ));
      
      if (skills?.length)
        await Promise.all(skills.map(skill =>
          postToPostgrest(
            'character_skills',
            { ...skill, character_id: characterId }, 
          )
        ));
      
      if (edges?.length)
        await Promise.all(edges.map(edge =>
          postToPostgrest(
            'character_edges',
            { ...edge, character_id: characterId }, 
          )
        ));
      
      if (hindrances?.length)
        await Promise.all(hindrances.map(h =>
          postToPostgrest(
            'character_hindrances',
            { ...h, character_id: characterId }, 
          )
        ));
      
      if (gear?.length)
        await Promise.all(gear.map(g =>
          postToPostgrest(
            'character_gear',
            { ...g, character_id: characterId },
          )
        ));
      
      if (weapons?.length)
        await Promise.all(weapons.map(w =>
          postToPostgrest(
            'character_weapons',
            { ...w, character_id: characterId }, 
          )
        ));
      
      if (powers?.length)
        await Promise.all(powers.map(p =>
          postToPostgrest(
            'character_powers',
            { ...p, character_id: characterId }, 
          )
        ));
      
    return characterId;
  }

  // Для сохранения потребуется mapCharacterToDb и отдельный endpoint
} 