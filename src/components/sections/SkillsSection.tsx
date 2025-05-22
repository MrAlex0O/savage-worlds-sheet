import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  TextField,
  FormControl,
  Stack,
  InputLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Skill, DieType, Language, AttributeType } from '../../types/character';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../linguistics';
import { SkillsRepository } from '../../repositories/SkillsRepository';

interface SkillsSectionProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
}

const attributes: AttributeType[] = ['Agility', 'Smarts', 'Spirit', 'Strength', 'Vigor'];
const dieTypes: DieType[] = ['d4', 'd6', 'd8', 'd10', 'd12'];

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onSkillsChange }) => {
  const { language } = useLanguage();
  const skillsRepo = SkillsRepository.getInstance();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language as Language);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const handleAddSkill = () => {
    const newSkill: Skill = {
      id: null,
      name: '',
      die: 'd4',
      modifier: 0,
      linkedAttribute: 'Agility',
      sourceId: 'CUSTOM',
      sourcePage: 0,
      language: language as Language
    };
    onSkillsChange([...skills, newSkill]);
  };

  const handleImportSkills = () => {
    const skillsToImport = skillsRepo.getSkills(selectedLanguage);
    const existingSkillNames = new Set(skills.map(skill => skill.name));
    const newSkills = skillsToImport.filter(skill => !existingSkillNames.has(skill.name));
    onSkillsChange([...skills, ...newSkills]);
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    onSkillsChange(newSkills);
  };

  const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
    const newSkills = [...skills];
    newSkills[index] = {
      ...newSkills[index],
      [field]: value,
    };
    onSkillsChange(newSkills);
  };

  const renderSkillDetails = (skill: Skill, index: number) => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t(language, 'skills', 'skillName')}
            value={skill.name}
            onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t(language, 'skills', 'dieType')}</InputLabel>
            <Select
              value={skill.die}
              onChange={(e) => handleSkillChange(index, 'die', e.target.value as DieType)}
              label={t(language, 'skills', 'dieType')}
            >
              {dieTypes.map((die) => (
                <MenuItem key={die} value={die}>
                  {die}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t(language, 'skills', 'modifier')}
            type="number"
            value={skill.modifier}
            onChange={(e) => handleSkillChange(index, 'modifier', parseInt(e.target.value) || 0)}
            fullWidth
            inputProps={{ min: -10, max: 10 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t(language, 'skills', 'linkedAttribute')}</InputLabel>
            <Select
              value={skill.linkedAttribute}
              onChange={(e) => handleSkillChange(index, 'linkedAttribute', e.target.value as AttributeType)}
              label={t(language, 'skills', 'linkedAttribute')}
            >
              {attributes.map((attr) => (
                <MenuItem key={attr} value={attr}>
                  {t(language, 'attributes', attr)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t(language, 'skills', 'sourcePage')}
            type="number"
            value={skill.sourcePage || 0}
            onChange={(e) => handleSkillChange(index, 'sourcePage', parseInt(e.target.value) || 0)}
            fullWidth
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">{t(language, 'skills', 'title')}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="skill-set-select-label">
              {t(language, 'skills', 'skillSet')}
            </InputLabel>
            <Select
              labelId="skill-set-select-label"
              value={selectedLanguage}
              label={t(language, 'skills', 'skillSet')}
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
            >
              {skillsRepo.getAllLanguages().map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang === 'en' ? 'SWADE Basic Skills' : 'SWADE Базовые Навыки'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleImportSkills}
          >
            {t(language, 'skills', 'importSkills')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSkill}
          >
            {t(language, 'skills', 'addSkill')}
          </Button>
          <Button
            variant="outlined"
            startIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Show'}
          </Button>
        </Stack>
      </Box>

      {isExpanded ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t(language, 'skills', 'skillName')}</TableCell>
                <TableCell>{t(language, 'skills', 'dieType')}</TableCell>
                <TableCell>{t(language, 'skills', 'modifier')}</TableCell>
                <TableCell>{t(language, 'skills', 'linkedAttribute')}</TableCell>
                <TableCell>{t(language, 'skills', 'sourcePage')}</TableCell>
                <TableCell>{t(language, 'skills', 'actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {skills.map((skill, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      value={skill.name}
                      onChange={(e) =>
                        handleSkillChange(index, 'name', e.target.value)
                      }
                      size="small"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={skill.die}
                      onChange={(e) =>
                        handleSkillChange(index, 'die', e.target.value as DieType)
                      }
                      size="small"
                    >
                      {dieTypes.map((die) => (
                        <MenuItem key={die} value={die}>
                          {die}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={skill.modifier}
                      onChange={(e) =>
                        handleSkillChange(index, 'modifier', parseInt(e.target.value) || 0)
                      }
                      size="small"
                      inputProps={{ min: -10, max: 10 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={skill.linkedAttribute}
                      onChange={(e) =>
                        handleSkillChange(index, 'linkedAttribute', e.target.value as AttributeType)
                      }
                      size="small"
                    >
                      {attributes.map((attr) => (
                        <MenuItem key={attr} value={attr}>
                          {t(language, 'attributes', attr)}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={skill.sourcePage || 0}
                      onChange={(e) =>
                        handleSkillChange(index, 'sourcePage', parseInt(e.target.value) || 0)
                      }
                      size="small"
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleRemoveSkill(index)}
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
                <TableCell>{t(language, 'skills', 'skillName')}</TableCell>
                <TableCell>{t(language, 'skills', 'dieType')}</TableCell>
                <TableCell>{t(language, 'skills', 'linkedAttribute')}</TableCell>
                <TableCell>{t(language, 'skills', 'actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {skills.map((skill, index) => (
                <TableRow key={index}>
                  <TableCell>{skill.name}</TableCell>
                  <TableCell>{skill.die}</TableCell>
                  <TableCell>{t(language, 'attributes', skill.linkedAttribute)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => setSelectedSkill(skill)}
                        size="small"
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleRemoveSkill(index)}
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

      <Dialog
        open={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedSkill?.name || t(language, 'skills', 'title')}
        </DialogTitle>
        <DialogContent>
          {selectedSkill && renderSkillDetails(selectedSkill, skills.findIndex(s => s === selectedSkill))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSkill(null)}>
            {t(language, 'general', 'cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillsSection; 