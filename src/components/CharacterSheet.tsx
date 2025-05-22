import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Character } from '../types/character';
import {
  loadCharacterFromStorage,
  saveCharacterToStorage,
} from '../services/localStorageService';
import {
  saveCharacterToFile,
  loadCharacterFromFile,
} from '../services/fileStorageService';
import { t } from '../linguistics';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppTheme, ThemeColor } from '../contexts/ThemeContext';
import AttributesSection from './sections/AttributesSection';
import SkillsSection from './sections/SkillsSection';
import DerivedStatsSection from './sections/DerivedStatsSection';
import CombatStatsSection from './sections/CombatStatsSection';
import GearSection from './sections/GearSection';
import PowersSection from './sections/PowersSection';
import CharacterInfoSection from './sections/CharacterInfoSection';
import EdgesHindrancesSection from './sections/EdgesHindrancesSection';
import LanguageSelector from './LanguageSelector';
import { CharacterPostgrestRepository } from '../repositories/pg/CharacterPostgrestRepository';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const initialCharacter: Character = {
  id: null,
  name: '',
  race: '',
  rank: 'Novice',
  experience: 0,
  attributes: {
    Agility: { id: null, die: 'd4', modifier: 0 },
    Smarts: { id: null, die: 'd4', modifier: 0 },
    Spirit: { id: null, die: 'd4', modifier: 0 },
    Strength: { id: null, die: 'd4', modifier: 0 },
    Vigor: { id: null, die: 'd4', modifier: 0 },
  },
  skills: [],
  derivedStats: {
    pace: 6,
    parry: 2,
    toughness: 4,
    charisma: 0,
  },
  edges: [],
  hindrances: [],
  gear: [],
  weapons: [],
  powers: [],
  wounds: 0,
  fatigue: 0,
  powerPoints: 0,
  bennies: 3,
};

const SAVE_DELAY = 3000; // 3 second delay

const CharacterSheet: React.FC = () => {
  const [character, setCharacter] = useState<Character>(() => {
    return loadCharacterFromStorage() || initialCharacter;
  });

  const { language } = useLanguage();
  const { themeColor, themeMode, setThemeColor, setThemeMode } = useAppTheme();
  const timerRef = useRef<NodeJS.Timeout>();
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [loadId, setLoadId] = useState('');

  useEffect(() => {
    timerRef.current = setInterval(() => {
      saveCharacterToStorage(character);
    }, SAVE_DELAY);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [character]);
 

  const handleCharacterChange = (updates: Partial<Character>) => {
    setCharacter((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSaveCharacter = () => {
    saveCharacterToFile(character);
  };

  const handleLoadCharacter = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const loadedCharacter = await loadCharacterFromFile(file);
        setCharacter(loadedCharacter);
      } catch (error) {
        console.error('Error loading character:', error);
        alert('Error loading character file');
      }
    }
  };

  const handleNewCharacter = () => {
    if (window.confirm(t(language, 'general', 'newCharacterConfirm'))) {
      setCharacter(initialCharacter);
    }
  };

  const handleSaveToDb = async () => {
    try {
      await CharacterPostgrestRepository.getInstance().saveCharacter(character);
      alert('Character saved to database!');
    } catch (e) {
      alert('Error saving character to database');
    }
  };

  const handleOpenLoadDialog = () => setIsLoadDialogOpen(true);
  const handleCloseLoadDialog = () => {
    setIsLoadDialogOpen(false);
    setLoadId('');
  };

  const handleConfirmLoadFromDb = async () => {
    const id = Number(loadId);
    
    try {
      const loaded = await CharacterPostgrestRepository.getInstance().getCharacterById(id);
      if (loaded) setCharacter(loaded);
      else alert('Character not found');
    } catch (e) {
      console.error('Error loading character from database', e);
      alert('Error loading character from database');
    }
    setIsLoadDialogOpen(false);
    setLoadId('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {t(language, 'general', 'title')}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="theme-color-label">Theme</InputLabel>
              <Select
                labelId="theme-color-label"
                value={themeColor}
                label="Theme"
                onChange={(e) => setThemeColor(e.target.value as ThemeColor)}
              >
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="purple">Purple</MenuItem>
                <MenuItem value="green">Green</MenuItem>
                <MenuItem value="brown">Brown</MenuItem>
                <MenuItem value="gray">Gray</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title={themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}>
              <IconButton onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')} size="small">
                {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Tooltip>
            <LanguageSelector />
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RestartAltIcon />}
            onClick={handleNewCharacter}
          >
            {t(language, 'general', 'newCharacter')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveCharacter}
          >
            {t(language, 'general', 'save')}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component="label"
          >
            {t(language, 'general', 'load')}
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleLoadCharacter}
            />
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSaveToDb}
          >
            {t(language, 'general', 'saveToDb')}
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={handleOpenLoadDialog}
          >
            {t(language, 'general', 'loadFromDb')}
          </Button>
        </Stack>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <CharacterInfoSection
            character={character}
            onCharacterChange={handleCharacterChange}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <AttributesSection
            attributes={character.attributes}
            onAttributesChange={(attributes) => handleCharacterChange({ attributes })}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <SkillsSection
            skills={character.skills}
            onSkillsChange={(skills) => handleCharacterChange({ skills })}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <DerivedStatsSection
            derivedStats={character.derivedStats}
            onDerivedStatsChange={(derivedStats) =>
              handleCharacterChange({ derivedStats })
            }
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <CombatStatsSection
            wounds={character.wounds}
            fatigue={character.fatigue}
            bennies={character.bennies}
            onStatsChange={(stats) => handleCharacterChange(stats)}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <EdgesHindrancesSection
            edges={character.edges}
            hindrances={character.hindrances}
            onEdgesChange={(edges) => handleCharacterChange({ edges })}
            onHindrancesChange={(hindrances) =>
              handleCharacterChange({ hindrances })
            }
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <GearSection
            gear={character.gear}
            weapons={character.weapons}
            onGearChange={(gear) => handleCharacterChange({ gear })}
            onWeaponsChange={(weapons) => handleCharacterChange({ weapons })}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <PowersSection
            powers={character.powers}
            powerPoints={character.powerPoints}
            onPowersChange={(powers) => handleCharacterChange({ powers })}
            onPowerPointsChange={(powerPoints) =>
              handleCharacterChange({ powerPoints })
            }
          />
        </Paper>

        <Dialog open={isLoadDialogOpen} onClose={handleCloseLoadDialog}>
          <DialogTitle>Загрузить персонажа из базы</DialogTitle>
          <DialogContent>
            <TextField
              label="ID персонажа"
              value={loadId}
              onChange={e => setLoadId(e.target.value)}
              type="number"
              fullWidth
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLoadDialog}>Отмена</Button>
            <Button onClick={handleConfirmLoadFromDb} variant="contained">Загрузить</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default CharacterSheet; 