import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  IconButton,
  Divider,
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
import { Gear, Weapon, Language } from '../../types/character';
import { t } from '../../linguistics';
import { useLanguage } from '../../contexts/LanguageContext';
import { WeaponsRepository } from '../../repositories/WeaponsRepository';
import LanguageSelector from '../LanguageSelector';
import { SourceType, sourceTypes } from '../../types/sourceType';
import { WeaponsPostgrestRepository } from '../../repositories/pg/WeaponsPostgrestRepository';

interface GearSectionProps {
  gear: Gear[];
  weapons: Weapon[];
  onGearChange: (gear: Gear[]) => void;
  onWeaponsChange: (weapons: Weapon[]) => void;
}

const GearSection: React.FC<GearSectionProps> = ({
  gear,
  weapons,
  onGearChange,
  onWeaponsChange,
}) => {
  const { language } = useLanguage();
  const [isWeaponsExpanded, setIsWeaponsExpanded] = useState(true);
  const [isGearExpanded, setIsGearExpanded] = useState(true);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [selectedGear, setSelectedGear] = useState<Gear | null>(null);
  const [isWeaponDialogOpen, setIsWeaponDialogOpen] = useState(false);
  const [selectedWeaponSourceId, setSelectedWeaponSourceId] = useState<SourceType>('SWADE');
  const [isLoadingWeapons, setIsLoadingWeapons] = useState(false);
  const [availableWeapons, setAvailableWeapons] = useState<Weapon[]>([]); 
  const weaponsRepoPg = WeaponsPostgrestRepository.getInstance();

  useEffect(() => {
    if (isWeaponDialogOpen) {
      setIsLoadingWeapons(true);
      weaponsRepoPg.getWeapons(language).then((allWeapons: Weapon[]) => {
        setAvailableWeapons(allWeapons.filter((w: Weapon) => w.sourceId === selectedWeaponSourceId));
        setIsLoadingWeapons(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeaponDialogOpen, language, selectedWeaponSourceId]);

  const handleAddGear = () => {
    const newGear: Gear = {
      id: null,
      name: '',
      weight: 0,
      notes: '',
      sourceId: 'CUSTOM'
    };
    onGearChange([...gear, newGear]);
  };

  const handleAddWeapon = () => {
    const newWeapon: Weapon = {
      id: null,
      name: '',
      damage: '',
      range: '',
      ap: 0,
      weight: 0,
      notes: '',
      sourceId: 'CUSTOM',
      sourcePage: 0, 
      language: language as Language
    };
    onWeaponsChange([...weapons, newWeapon]);
  };

  const handleAddExistingWeapon = (weapon: Weapon) => {
    onWeaponsChange([...weapons, { ...weapon }]);
    setIsWeaponDialogOpen(false);
  };

  const handleWeaponChange = (index: number, field: keyof Weapon, value: any) => {
    const newWeapons = [...weapons];
    newWeapons[index] = {
      ...newWeapons[index],
      [field]:
        field === 'weight' || field === 'ap' ? parseFloat(value) || 0 : value,
    };
    onWeaponsChange(newWeapons);
  };

  const handleGearChange = (index: number, field: keyof Gear, value: any) => {
    const newGear = [...gear];
    newGear[index] = {
      ...newGear[index],
      [field]: field === 'weight' ? parseFloat(value) || 0 : value,
    };
    onGearChange(newGear);
  };    

  const handleRemoveGear = (index: number) => {
    const newGear = gear.filter((_, i) => i !== index);
    onGearChange(newGear);
  };

  const handleRemoveWeapon = (index: number) => {
    const newWeapons = weapons.filter((_, i) => i !== index);
    onWeaponsChange(newWeapons);
  };

  const renderWeaponDetails = (weapon: Weapon) => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'weapons', 'weaponName')}
          value={weapon.name}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'weapons', 'range')}
          value={weapon.range}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'weapons', 'damage')}
          value={weapon.damage}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'weapons', 'ap')}
          type="number"
          value={weapon.ap}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'weapons', 'weight')}
          type="number"
          value={weapon.weight}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'weapons', 'sourcePage')}
          type="number"
          value={weapon.sourcePage || 0}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={t(language, 'weapons', 'notes')}
          value={weapon.notes}
          InputProps={{ readOnly: true }}
          multiline
          rows={2}
          fullWidth
        />
      </Grid>
    </Grid>
  );

  const renderGearDetails = (item: Gear, index: number) => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'gear', 'itemName')}
          value={item.name}
          onChange={(e) =>
            handleGearChange(index, 'name', e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label={t(language, 'gear', 'weight')}
          type="number"
          value={item.weight || 0}
          onChange={(e) =>
            handleGearChange(index, 'weight', e.target.value)
          }
          fullWidth
          inputProps={{ min: 0, step: 0.1 }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={t(language, 'gear', 'notes')}
          value={item.notes || ''}
          onChange={(e) =>
            handleGearChange(index, 'notes', e.target.value)
          }
          multiline
          rows={2}
          fullWidth
        />
      </Grid>
    </Grid>
  );

  const renderWeaponDialog = () => (
    <Dialog 
      open={isWeaponDialogOpen} 
      onClose={() => setIsWeaponDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{t(language, 'weapons', 'selectWeapon')}
        <LanguageSelector />
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Source</InputLabel>
          <Select
            value={selectedWeaponSourceId}
            label="Source"
            onChange={e => setSelectedWeaponSourceId(e.target.value as SourceType)}
          >
            {sourceTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {(
          <List>
            {availableWeapons.map((weapon, index) => (
              <ListItem key={index} button onClick={() => handleAddExistingWeapon(weapon)}>
                <ListItemText
                  primary={weapon.name}
                  secondary={`${t(language, 'weapons', 'damage')}: ${weapon.damage}, ${t(language, 'weapons', 'range')}: ${weapon.range}${weapon.sourcePage ? ` (${t(language, 'general', 'page')} ${weapon.sourcePage})` : ''}`}
                />
                <ListItemSecondaryAction>
                  <Typography variant="body2" color="textSecondary">
                    {weapon.notes}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsWeaponDialogOpen(false)}>
          {t(language, 'general', 'cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">{t(language, 'weapons', 'title')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setIsWeaponDialogOpen(true)}
              >
                {t(language, 'weapons', 'addExisting')}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddWeapon}
              >
                {t(language, 'weapons', 'addWeapon')}
              </Button>
              <Button
                variant="outlined"
                startIcon={isWeaponsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setIsWeaponsExpanded(!isWeaponsExpanded)}
              >
                {isWeaponsExpanded ? 'Collapse' : 'Show'}
              </Button>
            </Box>
          </Box>
          {isWeaponsExpanded ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t(language, 'weapons', 'weaponName')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'damage')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'range')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'ap')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'weight')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'sourcePage')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'notes')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weapons.map((weapon, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          value={weapon.name}
                          onChange={(e) =>
                            handleWeaponChange(index, 'name', e.target.value)
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={weapon.damage}
                          onChange={(e) =>
                            handleWeaponChange(index, 'damage', e.target.value)
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={weapon.range}
                          onChange={(e) =>
                            handleWeaponChange(index, 'range', e.target.value)
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={weapon.ap}
                          onChange={(e) =>
                            handleWeaponChange(index, 'ap', e.target.value)
                          }
                          size="small"
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={weapon.weight}
                          onChange={(e) =>
                            handleWeaponChange(index, 'weight', e.target.value)
                          }
                          size="small"
                          inputProps={{ min: 0, step: 0.1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={weapon.sourcePage || 0}
                          onChange={(e) =>
                            handleWeaponChange(index, 'sourcePage', parseInt(e.target.value) || 0)
                          }
                          size="small"
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={weapon.notes}
                          onChange={(e) =>
                            handleWeaponChange(index, 'notes', e.target.value)
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleRemoveWeapon(index)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t(language, 'weapons', 'weaponName')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'damage')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'range')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'ap')}</TableCell>
                    <TableCell>{t(language, 'weapons', 'actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weapons.map((weapon, index) => (
                    <TableRow key={index}>
                      <TableCell>{weapon.name}</TableCell>
                      <TableCell>{weapon.damage}</TableCell>
                      <TableCell>{weapon.range}</TableCell>
                      <TableCell>{weapon.ap}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            onClick={() => setSelectedWeapon(weapon)}
                            size="small"
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleRemoveWeapon(index)}
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
          )}
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">{t(language, 'gear', 'title')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddGear}
              >
                {t(language, 'gear', 'addGear')}
              </Button>
              <Button
                variant="outlined"
                startIcon={isGearExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setIsGearExpanded(!isGearExpanded)}
              >
                {isGearExpanded ? 'Collapse' : 'Show'}
              </Button>
            </Box>
          </Box>
          {isGearExpanded ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t(language, 'gear', 'itemName')}</TableCell>
                    <TableCell>{t(language, 'gear', 'weight')}</TableCell>
                    <TableCell>{t(language, 'gear', 'notes')}</TableCell>
                    <TableCell>{t(language, 'gear', 'actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gear.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          value={item.name}
                          onChange={(e) =>
                            handleGearChange(index, 'name', e.target.value)
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.weight || 0}
                          onChange={(e) =>
                            handleGearChange(index, 'weight', e.target.value)
                          }
                          size="small"
                          inputProps={{ min: 0, step: 0.1 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={item.notes || ''}
                          onChange={(e) =>
                            handleGearChange(index, 'notes', e.target.value)
                          }
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleRemoveGear(index)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t(language, 'gear', 'itemName')}</TableCell>
                    <TableCell>{t(language, 'gear', 'weight')}</TableCell>
                    <TableCell>{t(language, 'gear', 'actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gear.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.weight || 0}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            onClick={() => setSelectedGear(item)}
                            size="small"
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleRemoveGear(index)}
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
          )}
        </Grid>
      </Grid>

      <Dialog 
        open={!!selectedWeapon} 
        onClose={() => setSelectedWeapon(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedWeapon?.name || t(language, 'weapons', 'title')}
        </DialogTitle>
        <DialogContent>
          {selectedWeapon && renderWeaponDetails(selectedWeapon)}
        </DialogContent>
      </Dialog>

      <Dialog 
        open={!!selectedGear} 
        onClose={() => setSelectedGear(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedGear?.name || t(language, 'gear', 'title')}
        </DialogTitle>
        <DialogContent>
          {selectedGear && renderGearDetails(selectedGear, gear.findIndex(g => g === selectedGear))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedGear(null)}>
            {t(language, 'general', 'cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      {renderWeaponDialog()}
    </Box>
  );
};

export default GearSection; 