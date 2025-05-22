export type SourceType = 
  | 'SWADE'  // Savage Worlds Adventure Edition
  | 'SWADE_COMPANION'  // SWADE Companion
  | 'FANTASY_COMPANION'
  | 'HORROR_COMPANION'
  | 'SCI_FI_COMPANION'
  | 'SUPER_POWERS_COMPANION'
  | 'CUSTOM'  // For house rules or custom content
  | 'HOMEBREW';  // For community content

  export const sourceTypes: SourceType[] = [
    'SWADE',
    'SWADE_COMPANION',
    'FANTASY_COMPANION',
    'HORROR_COMPANION',
    'SCI_FI_COMPANION',
    'SUPER_POWERS_COMPANION',
    'CUSTOM',
    'HOMEBREW',
  ];