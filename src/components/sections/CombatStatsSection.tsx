import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../linguistics';

interface CombatStatsSectionProps {
  wounds: number;
  fatigue: number;
  bennies: number;
  onStatsChange: (stats: {
    wounds?: number;
    fatigue?: number;
    bennies?: number;
  }) => void;
}

const CombatStatsSection: React.FC<CombatStatsSectionProps> = ({
  wounds,
  fatigue,
  bennies,
  onStatsChange,
}) => {
  const { language } = useLanguage();

  const handleIncrement = (stat: 'wounds' | 'fatigue' | 'bennies') => {
    const maxValue = stat === 'bennies' ? 4 : 6;
    const currentValue = stat === 'wounds' ? wounds : stat === 'fatigue' ? fatigue : bennies;
    if (currentValue < maxValue) {
      onStatsChange({ [stat]: currentValue + 1 });
    }
  };

  const handleDecrement = (stat: 'wounds' | 'fatigue' | 'bennies') => {
    const currentValue = stat === 'wounds' ? wounds : stat === 'fatigue' ? fatigue : bennies;
    if (currentValue > 0) {
      onStatsChange({ [stat]: currentValue - 1 });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t(language, 'combat', 'title')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label={t(language, 'combat', 'wounds')}
              type="number"
              value={wounds}
              InputProps={{
                readOnly: true,
                inputProps: { min: 0, max: 6 },
              }}
              fullWidth
            />
            <Box>
              <IconButton
                onClick={() => handleIncrement('wounds')}
                disabled={wounds >= 6}
                color="primary"
                size="small"
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDecrement('wounds')}
                disabled={wounds <= 0}
                color="primary"
                size="small"
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label={t(language, 'combat', 'fatigue')}
              type="number"
              value={fatigue}
              InputProps={{
                readOnly: true,
                inputProps: { min: 0, max: 6 },
              }}
              fullWidth
            />
            <Box>
              <IconButton
                onClick={() => handleIncrement('fatigue')}
                disabled={fatigue >= 6}
                color="primary"
                size="small"
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDecrement('fatigue')}
                disabled={fatigue <= 0}
                color="primary"
                size="small"
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label={t(language, 'combat', 'bennies')}
              type="number"
              value={bennies}
              InputProps={{
                readOnly: true,
                inputProps: { min: 0, max: 4 },
              }}
              fullWidth
            />
            <Box>
              <IconButton
                onClick={() => handleIncrement('bennies')}
                disabled={bennies >= 4}
                color="primary"
                size="small"
              >
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDecrement('bennies')}
                disabled={bennies <= 0}
                color="primary"
                size="small"
              >
                <RemoveIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CombatStatsSection; 