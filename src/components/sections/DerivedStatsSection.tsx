import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import { Character } from '../../types/character';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../linguistics';

interface DerivedStatsSectionProps {
  derivedStats: Character['derivedStats'];
  onDerivedStatsChange: (derivedStats: Character['derivedStats']) => void;
}

const DerivedStatsSection: React.FC<DerivedStatsSectionProps> = ({
  derivedStats,
  onDerivedStatsChange,
}) => {
  const { language } = useLanguage();

  const handleStatChange = (stat: keyof Character['derivedStats'], value: string) => {
    onDerivedStatsChange({
      ...derivedStats,
      [stat]: parseInt(value) || 0,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t(language, 'derivedStats', 'title')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label={t(language, 'derivedStats', 'pace')}
            type="number"
            value={derivedStats.pace}
            onChange={(e) => handleStatChange('pace', e.target.value)}
            fullWidth
            InputProps={{
              inputProps: { min: 0 },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label={t(language, 'derivedStats', 'parry')}
            type="number"
            value={derivedStats.parry}
            onChange={(e) => handleStatChange('parry', e.target.value)}
            fullWidth
            InputProps={{
              inputProps: { min: 0 },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label={t(language, 'derivedStats', 'toughness')}
            type="number"
            value={derivedStats.toughness}
            onChange={(e) => handleStatChange('toughness', e.target.value)}
            fullWidth
            InputProps={{
              inputProps: { min: 0 },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label={t(language, 'derivedStats', 'charisma')}
            type="number"
            value={derivedStats.charisma}
            onChange={(e) => handleStatChange('charisma', e.target.value)}
            fullWidth
            InputProps={{
              inputProps: { min: -4, max: 4 },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DerivedStatsSection; 