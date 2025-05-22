import { Character } from '../types/character';

export const saveCharacterToFile = (character: Character): void => {
    const characterData = JSON.stringify(character, null, 2);
    const blob = new Blob([characterData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name || 'character'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  export const loadCharacterFromFile = async (file: File): Promise<Character> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedCharacter = JSON.parse(e.target?.result as string);
          resolve(loadedCharacter);
        } catch (error) {
          reject(new Error('Invalid character file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }; 