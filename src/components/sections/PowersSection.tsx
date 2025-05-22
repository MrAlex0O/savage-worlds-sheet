import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography as MuiTypography,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Character, Power, Language } from '../../types/character';
import { t } from '../../linguistics';
import { useLanguage } from '../../contexts/LanguageContext';
import { PowersPostgrestRepository } from '../../repositories/pg/PowersPostgrestRepository';
import LanguageSelector from '../LanguageSelector';
import { SourceType, sourceTypes } from '../../types/sourceType';

interface PowersSectionProps {
  powers: Power[];
  powerPoints: number;
  onPowersChange: (powers: Power[]) => void;
  onPowerPointsChange: (points: number) => void;
}

const PowersSection: React.FC<PowersSectionProps> = ({
  powers,
  powerPoints,
  onPowersChange,
  onPowerPointsChange,
}) => {
  const {language} = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedPower, setSelectedPower] = useState<Power | null>(null);
  const [isPowerDialogOpen, setIsPowerDialogOpen] = useState(false);
  const [availablePowers, setAvailablePowers] = useState<Power[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<SourceType>('SWADE');
  const [isLoadingPowers, setIsLoadingPowers] = useState(false);
  const powersRepo = PowersPostgrestRepository.getInstance();

  

  useEffect(() => {
    if (isPowerDialogOpen) {
      setIsLoadingPowers(true);
      powersRepo.getPowers(language as Language).then((allPowers) => {
        setAvailablePowers(allPowers.filter(p => p.sourceId === selectedSourceId));
        setIsLoadingPowers(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPowerDialogOpen, language, selectedSourceId]);

  const handleAddPower = () => {
    const newPower: Power = {
      id: null,
      name: '',
      powerPoints: 0,
      range: '',
      duration: '',
      effect: '',
      sourceId: 'CUSTOM' as SourceType,
      language: language as Language
    };
    onPowersChange([...powers, newPower]);
  };

  const handleAddExistingPower = (power: Power) => {
    onPowersChange([...powers, { ...power }]);
    setIsPowerDialogOpen(false);
  };

  const handlePowerChange = (
    index: number,
    field: keyof Character['powers'][0],
    value: any
  ) => {
    const newPowers = [...powers];
    newPowers[index] = {
      ...newPowers[index],
      [field]: field === 'powerPoints' ? parseInt(value) || 0 : value,
    };
    onPowersChange(newPowers);
  };

  const handleRemovePower = (index: number) => {
    const newPowers = powers.filter((_, i) => i !== index);
    onPowersChange(newPowers);
  };

  const renderPowerDetails = (power: Power) => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'powers', 'powerName')}
          value={power.name}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'powers', 'powerPoints')}
          type="number"
          value={power.powerPoints}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'powers', 'range')}
          value={power.range}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'powers', 'duration')}
          value={power.duration}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'powers', 'sourcePage')}
          type="number"
          value={power.sourcePage || 0}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={t(language, 'powers', 'effect')}
          value={power.effect}
          InputProps={{ readOnly: true }}
          multiline
          rows={2}
          fullWidth
        />
      </Grid>
    </Grid>
  );

  const renderCollapsedView = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t(language, 'powers', 'powerName')}</TableCell>
            <TableCell>{t(language, 'powers', 'powerPoints')}</TableCell>
            <TableCell>{t(language, 'powers', 'range')}</TableCell>
            <TableCell>{t(language, 'powers', 'duration')}</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {powers.map((power, index) => (
            <TableRow key={index}>
              <TableCell>{power.name}</TableCell>
              <TableCell>{power.powerPoints}</TableCell>
              <TableCell>{power.range}</TableCell>
              <TableCell>{power.duration}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => setSelectedPower(power)}
                    size="small"
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleRemovePower(index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderExpandedView = () => (
    <>
      {powers.map((power, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t(language, 'powers', 'powerName')}
                  value={power.name}
                  onChange={(e) =>
                    handlePowerChange(index, 'name', e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t(language, 'powers', 'powerPoints')}
                  type="number"
                  value={power.powerPoints}
                  onChange={(e) =>
                    handlePowerChange(index, 'powerPoints', e.target.value)
                  }
                  fullWidth
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t(language, 'powers', 'range')}
                  value={power.range}
                  onChange={(e) =>
                    handlePowerChange(index, 'range', e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t(language, 'powers', 'duration')}
                  value={power.duration}
                  onChange={(e) =>
                    handlePowerChange(index, 'duration', e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t(language, 'powers', 'sourcePage')}
                  type="number"
                  value={power.sourcePage || 0}
                  onChange={(e) =>
                    handlePowerChange(index, 'sourcePage', parseInt(e.target.value) || 0)
                  }
                  fullWidth
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t(language, 'powers', 'effect')}
                  value={power.effect}
                  onChange={(e) =>
                    handlePowerChange(index, 'effect', e.target.value)
                  }
                  multiline
                  rows={2}
                  fullWidth
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <IconButton
              onClick={() => handleRemovePower(index)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </>
  );

  const renderPowerDialog = () => (
    <Dialog 
      open={isPowerDialogOpen} 
      onClose={() => setIsPowerDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{t(language, 'powers', 'selectPower')}
        <LanguageSelector />
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Source</InputLabel>
          <Select
            value={selectedSourceId}
            label="Source"
            onChange={e => setSelectedSourceId(e.target.value as SourceType)}
          >
            {sourceTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        { (
          <List>
            {availablePowers.map((power, index) => (
              <ListItem key={index} button onClick={() => handleAddExistingPower(power)}>
                <ListItemText
                  primary={power.name}
                  secondary={`${t(language, 'powers', 'powerPoints')}: ${power.powerPoints}, ${t(language, 'powers', 'range')}: ${power.range}${power.sourcePage ? ` (${t(language, 'general', 'page')} ${power.sourcePage})` : ''}`}
                />
                <ListItemSecondaryAction>
                  <MuiTypography variant="body2" color="textSecondary">
                    {power.effect}
                  </MuiTypography>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsPowerDialogOpen(false)}>
          {t(language, 'general', 'cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <MuiTypography variant="h6">{t(language, 'powers', 'title')}</MuiTypography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label={t(language, 'powers', 'powerPoints')}
                type="number"
                value={powerPoints}
                onChange={(e) => onPowerPointsChange(parseInt(e.target.value) || 0)}
                size="small"
                sx={{ width: 120 }}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setIsPowerDialogOpen(true)}
              >
                {t(language, 'powers', 'addExisting')}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddPower}
              >
                {t(language, 'powers', 'addPower')}
              </Button>
              <Button
                variant="outlined"
                startIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Collapse' : 'Show'}
              </Button>
            </Box>
          </Box>
          {isExpanded ? renderExpandedView() : renderCollapsedView()}
        </Grid>
      </Grid>

      <Dialog 
        open={!!selectedPower} 
        onClose={() => setSelectedPower(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPower?.name || t(language, 'powers', 'title')}
        </DialogTitle>
        <DialogContent>
          {selectedPower && renderPowerDetails(selectedPower)}
        </DialogContent>
      </Dialog>

      {renderPowerDialog()}
    </Box>
  );
};

export default PowersSection; 