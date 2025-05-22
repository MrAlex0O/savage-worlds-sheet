import { Character } from '../types/character';

const STORAGE_KEY = 'savageWorldsCharacter';

export const loadCharacterFromStorage = (): Character | null => {
  try {
    const savedCharacter = localStorage.getItem(STORAGE_KEY);
    return savedCharacter ? JSON.parse(savedCharacter) : null;
  } catch (error) {
    console.error('Error loading character from storage:', error);
    return null;
  }
};

export const saveCharacterToStorage = (character: Character): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
  } catch (error) {
    console.error('Error saving character to storage:', error);
  }
};

