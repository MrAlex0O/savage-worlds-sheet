import React from 'react';
import {
  IconButton,
  Tooltip, 
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate'; 
import { t } from '../linguistics';
import { useLanguage } from '../contexts/LanguageContext'; 

const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const handleLanguageToggle = () => {
        setLanguage(language === 'en' ? 'ru' : 'en');
    };

    return (
        <Tooltip title={t(language, 'general', 'language')}>
              <IconButton onClick={handleLanguageToggle} size="small">
                <TranslateIcon />
              </IconButton>
            </Tooltip>
    )
}


export default LanguageSelector; 