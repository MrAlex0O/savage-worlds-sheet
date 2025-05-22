import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Edge, Hindrance, Language } from '../../types/character';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../linguistics';
import LanguageSelector from '../LanguageSelector';
import { SourceType, sourceTypes } from '../../types/sourceType';
import { EdgesPostgrestRepository } from '../../repositories/pg/EdgesPostgrestRepository';
import { HindrancesPostgrestRepository } from '../../repositories/pg/HindrancesPostgrestRepository';

interface EdgesHindrancesSectionProps {
  edges: Edge[];
  hindrances: Hindrance[];
  onEdgesChange: (edges: Edge[]) => void;
  onHindrancesChange: (hindrances: Hindrance[]) => void;
}

const EdgesHindrancesSection: React.FC<EdgesHindrancesSectionProps> = ({
  edges,
  hindrances,
  onEdgesChange,
  onHindrancesChange,
}) => {
  const { language } = useLanguage();
  const [isEdgesExpanded, setIsEdgesExpanded] = useState(true);
  const [isHindrancesExpanded, setIsHindrancesExpanded] = useState(true);
  const [isEdgeDialogOpen, setIsEdgeDialogOpen] = useState(false);
  const [isHindranceDialogOpen, setIsHindranceDialogOpen] = useState(false);
  const [selectedEdgeSourceId, setSelectedEdgeSourceId] = useState<SourceType>('SWADE');
  const [selectedHindranceSourceId, setSelectedHindranceSourceId] = useState<SourceType>('SWADE');
  const [isLoadingEdges, setIsLoadingEdges] = useState(false);
  const [isLoadingHindrances, setIsLoadingHindrances] = useState(false);
  const [availableEdges, setAvailableEdges] = useState<Edge[]>([]);
  const [availableHindrances, setAvailableHindrances] = useState<Hindrance[]>([]);
  const edgesRepo = EdgesPostgrestRepository.getInstance();
  const hindrancesRepo = HindrancesPostgrestRepository.getInstance();

  useEffect(() => {
    if (isEdgeDialogOpen) {
      setIsLoadingEdges(true);
      edgesRepo.getEdges(language).then((allEdges) => {
        setAvailableEdges(allEdges.filter(e => e.sourceId === selectedEdgeSourceId));
        setIsLoadingEdges(false);
      });
    }
  }, [isEdgeDialogOpen, language, selectedEdgeSourceId]);

  useEffect(() => {
    if (isHindranceDialogOpen) {
      setIsLoadingHindrances(true);
      hindrancesRepo.getHindrances(language).then((allHindrances) => {
        setAvailableHindrances(allHindrances.filter(h => h.sourceId === selectedHindranceSourceId));
        setIsLoadingHindrances(false);
      });
    }
  }, [isHindranceDialogOpen, language, selectedHindranceSourceId]);

  const handleAddEdge = () => {
    const newEdge: Edge = {
      id: null,
      name: '',
      description: '',
      sourceId: 'CUSTOM',
      language: language as Language
    };
    onEdgesChange([...edges, newEdge]);
  };

  const handleAddHindrance = () => {
    const newHindrance: Hindrance = {
      id: null,
      name: '',
      description: '',
      type: 'Minor',
      sourceId: 'CUSTOM',
      language: language as Language
    };
    onHindrancesChange([...hindrances, newHindrance]);
  };

  const handleEdgeChange = (index: number, field: keyof Edge, value: string) => {
    const newEdges = [...edges];
    newEdges[index] = {
      ...newEdges[index],
      [field]: value,
    };
    onEdgesChange(newEdges);
  };

  const handleHindranceChange = (
    index: number,
    field: keyof Hindrance,
    value: string
  ) => {
    const newHindrances = [...hindrances];
    newHindrances[index] = {
      ...newHindrances[index],
      [field]: value,
    };
    onHindrancesChange(newHindrances);
  };

  const handleRemoveEdge = (index: number) => {
    const newEdges = edges.filter((_, i) => i !== index);
    onEdgesChange(newEdges);
  };

  const handleRemoveHindrance = (index: number) => {
    const newHindrances = hindrances.filter((_, i) => i !== index);
    onHindrancesChange(newHindrances);
  };

  const handleAddExistingEdge = (edge: Edge) => {
    edge.id = null;
    onEdgesChange([...edges, { ...edge }]);
    setIsEdgeDialogOpen(false);
  };

  const handleAddExistingHindrance = (hindrance: Hindrance) => {
    hindrance.id = null;
    onHindrancesChange([...hindrances, { ...hindrance }]);
    setIsHindranceDialogOpen(false);
  };

  const renderCollapsedEdges = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t(language, 'edges', 'edgeName')}</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {edges.map((edge, index) => (
            <TableRow key={index}>
              <TableCell>{edge.name}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleRemoveEdge(index)}
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
  );

  const renderExpandedEdges = () => (
    <>
      {edges.map((edge, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={t(language, 'edges', 'edgeName')}
                  value={edge.name}
                  onChange={(e) =>
                    handleEdgeChange(index, 'name', e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t(language, 'edges', 'description')}
                  value={edge.description}
                  onChange={(e) =>
                    handleEdgeChange(index, 'description', e.target.value)
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
              onClick={() => handleRemoveEdge(index)}
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

  const renderCollapsedHindrances = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t(language, 'hindrances', 'hindranceName')}</TableCell>
            <TableCell>{t(language, 'hindrances', 'type')}</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hindrances.map((hindrance, index) => (
            <TableRow key={index}>
              <TableCell>{hindrance.name}</TableCell>
              <TableCell>{hindrance.type}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleRemoveHindrance(index)}
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
  );

  const renderExpandedHindrances = () => (
    <>
      {hindrances.map((hindrance, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  label={t(language, 'hindrances', 'hindranceName')}
                  value={hindrance.name}
                  onChange={(e) =>
                    handleHindranceChange(index, 'name', e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>{t(language, 'hindrances', 'type')}</InputLabel>
                  <Select
                    value={hindrance.type}
                    label={t(language, 'hindrances', 'type')}
                    onChange={(e) =>
                      handleHindranceChange(
                        index,
                        'type',
                        e.target.value as 'Major' | 'Minor'
                      )
                    }
                  >
                    <MenuItem value="Minor">{t(language, 'hindrances', 'minor')}</MenuItem>
                    <MenuItem value="Major">{t(language, 'hindrances', 'major')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t(language, 'hindrances', 'description')}
                  value={hindrance.description}
                  onChange={(e) =>
                    handleHindranceChange(index, 'description', e.target.value)
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
              onClick={() => handleRemoveHindrance(index)}
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

  const renderEdgeDialog = () => (
    <Dialog open={isEdgeDialogOpen} onClose={() => setIsEdgeDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>{t(language, 'edges', 'title')} 
        <LanguageSelector />
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Source</InputLabel>
          <Select
            value={selectedEdgeSourceId}
            label="Source"
            onChange={e => setSelectedEdgeSourceId(e.target.value as SourceType)}
          >
            {sourceTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {(
          <List>
            {availableEdges.map((edge, index) => (
              <ListItem key={index} button onClick={() => handleAddExistingEdge(edge)}>
                <ListItemText primary={edge.name} secondary={edge.description} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsEdgeDialogOpen(false)}>{t(language, 'general', 'cancel')}</Button>
      </DialogActions>
    </Dialog>
  );

  const renderHindranceDialog = () => (
    <Dialog open={isHindranceDialogOpen} onClose={() => setIsHindranceDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>{t(language, 'hindrances', 'title')} <LanguageSelector /></DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Source</InputLabel>
          <Select
            value={selectedHindranceSourceId}
            label="Source"
            onChange={e => setSelectedHindranceSourceId(e.target.value as SourceType)}
          >
            {sourceTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {(
          <List>
            {availableHindrances.map((hindrance, index) => (
              <ListItem key={index} button onClick={() => handleAddExistingHindrance(hindrance)}>
                <ListItemText primary={hindrance.name} secondary={hindrance.description} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsHindranceDialogOpen(false)}>{t(language, 'general', 'cancel')}</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">{t(language, 'edges', 'title')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setIsEdgeDialogOpen(true)}
              >
                {t(language, 'edges', 'addExisting')}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddEdge}
              >
                {t(language, 'edges', 'addEdge')}
              </Button>
              <Button
                variant="outlined"
                startIcon={isEdgesExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setIsEdgesExpanded(!isEdgesExpanded)}
              >
                {isEdgesExpanded ? 'Collapse' : 'Show'}
              </Button>
            </Box>
          </Box>
          {isEdgesExpanded ? renderExpandedEdges() : renderCollapsedEdges()}
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">{t(language, 'hindrances', 'title')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setIsHindranceDialogOpen(true)}
              >
                {t(language, 'hindrances', 'addExisting')}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddHindrance}
              >
                {t(language, 'hindrances', 'addHindrance')}
              </Button>
              <Button
                variant="outlined"
                startIcon={isHindrancesExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setIsHindrancesExpanded(!isHindrancesExpanded)}
              >
                {isHindrancesExpanded ? 'Collapse' : 'Show'}
              </Button>
            </Box>
          </Box>
          {isHindrancesExpanded ? renderExpandedHindrances() : renderCollapsedHindrances()}
        </Grid>
      </Grid>
      {renderEdgeDialog()}
      {renderHindranceDialog()}
    </Box>
  );
};

export default EdgesHindrancesSection;