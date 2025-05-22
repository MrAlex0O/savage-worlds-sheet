import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Character, RankType } from '../../types/character';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../linguistics';

interface CharacterInfoSectionProps {
  character: Character;
  onCharacterChange: (updates: Partial<Character>) => void;
}

const ranks: RankType[] = ['Novice', 'Seasoned', 'Veteran', 'Heroic', 'Legendary'];

const CharacterInfoSection: React.FC<CharacterInfoSectionProps> = ({
  character,
  onCharacterChange,
}) => {
  const { language } = useLanguage();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t(language, 'characterInfo', 'title')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label={t(language, 'characterInfo', 'name')}
            value={character.name}
            onChange={(e) => onCharacterChange({ name: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label={t(language, 'characterInfo', 'race')}
            value={character.race}
            onChange={(e) => onCharacterChange({ race: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="rank-label">{t(language, 'characterInfo', 'rank')}</InputLabel>
            <Select
              labelId="rank-label"
              value={character.rank}
              label={t(language, 'characterInfo', 'rank')}
              onChange={(e) => onCharacterChange({ rank: e.target.value as RankType })}
            >
              {ranks.map((rank) => (
                <MenuItem key={rank} value={rank}>
                  {rank}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label={t(language, 'characterInfo', 'experience')}
            type="number"
            value={character.experience}
            onChange={(e) =>
              onCharacterChange({ experience: parseInt(e.target.value) || 0 })
            }
            fullWidth
            InputProps={{
              inputProps: { min: 0 },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CharacterInfoSection; 