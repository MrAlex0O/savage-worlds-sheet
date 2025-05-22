import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material';
import { Attribute, AttributeType, DieType } from '../../types/character';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../linguistics';

interface AttributesSectionProps {
  attributes: Record<AttributeType, Attribute>;
  onAttributesChange: (attributes: Record<AttributeType, Attribute>) => void;
}

const dieTypes = [4, 6, 8, 10, 12];

const AttributesSection: React.FC<AttributesSectionProps> = ({
  attributes,
  onAttributesChange,
}) => {
  const { language } = useLanguage();

  const handleDieChange = (
    attributeName: AttributeType,
    value: number
  ) => {
    onAttributesChange({
      ...attributes,
      [attributeName]: {
        ...attributes[attributeName],
        die: `d${value}` as DieType,
      },
    });
  };

  const handleModifierChange = (
    attributeName: AttributeType,
    value: string
  ) => {
    const numericValue = parseInt(value) || 0;
    onAttributesChange({
      ...attributes,
      [attributeName]: {
        ...attributes[attributeName],
        modifier: numericValue,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t(language, 'attributes', 'title')}
      </Typography>
      <Grid container spacing={3}>
        {(Object.keys(attributes) as AttributeType[]).map(
          (attributeName) => (
            <Grid key={attributeName} item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id={`${attributeName}-die-label`}>
                    {t(language, 'attributes', attributeName)}
                  </InputLabel>
                  <Select
                    labelId={`${attributeName}-die-label`}
                    value={parseInt(String(attributes[attributeName].die).substring(1))}
                    label={t(language, 'attributes', attributeName)}
                    onChange={(e) =>
                      handleDieChange(attributeName, e.target.value as number)
                    }
                  >
                    {dieTypes.map((die) => (
                      <MenuItem key={die} value={die}>
                        d{die}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label={t(language, 'attributes', 'modifier')}
                  type="number"
                  size="small"
                  value={attributes[attributeName].modifier}
                  onChange={(e) =>
                    handleModifierChange(attributeName, e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: -4,
                    max: 4,
                  }}
                  sx={{ width: 100 }}
                />
              </Box>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};

export default AttributesSection; 