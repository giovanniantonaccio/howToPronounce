import React, { useCallback, useState, useEffect, useMemo } from 'react';
import * as _ from 'lodash';

import api from 'services/api';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SvgIcon from '@material-ui/core/SvgIcon';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import { useStyles } from './styles';

import hero from 'assets/hero.svg';
import arAR from 'assets/flags/ar-AR.svg';
import deDE from 'assets/flags/de-DE.svg';
import enGB from 'assets/flags/en-GB.svg';
import enUS from 'assets/flags/en-US.svg';
import esES from 'assets/flags/es-ES.svg';
import esLA from 'assets/flags/es-LA.svg';
import esUS from 'assets/flags/es-US.svg';
import frFR from 'assets/flags/fr-FR.svg';
import itIT from 'assets/flags/it-IT.svg';
import jaJP from 'assets/flags/ja-JP.svg';
import koKR from 'assets/flags/ko-KR.svg';
import nlNL from 'assets/flags/nl-NL.svg';
import ptBR from 'assets/flags/pt-BR.svg';
import zhCN from 'assets/flags/zh-CN.svg';

const countryFlags = {
  'ar-AR': arAR,
  'de-DE': deDE,
  'en-GB': enGB,
  'en-US': enUS,
  'es-ES': esES,
  'es-LA': esES,
  'es-US': esES,
  'fr-FR': frFR,
  'it-IT': itIT,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'nl-NL': nlNL,
  'pt-BR': ptBR,
  'zh-CN': zhCN,
};

interface Voice {
  gender: 'female' | 'male';
  language:
    | 'ar-AR'
    | 'de-DE'
    | 'en-GB'
    | 'en-US'
    | 'es-ES'
    | 'es-LA'
    | 'es-US'
    | 'fr-FR'
    | 'it-IT'
    | 'ja-JP'
    | 'ko-KR'
    | 'nl-NL'
    | 'pt-BR'
    | 'zh-CN';
  name: 'string';
}

const Landing: React.FC = () => {
  const classes = useStyles();

  const [text, setText] = useState('');
  const [pronunciation, setPronunciation] = useState<string | undefined>();
  const [voices, setVoices] = useState({} as Record<string, Voice[]>);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  // get voices
  useEffect(() => {
    api
      .get<{ voices: Voice[] }>('voices')
      .then(result => {
        const filteredVoices = result.data.voices.filter(
          voice => !['es-LA', 'es-US'].includes(voice.language),
        );
        const sortedVoices = _.sortBy(filteredVoices, 'language');
        const groupedVoices = _.groupBy(sortedVoices, 'language');

        setVoices({ ...groupedVoices });
        setSelectedLanguage('fr-FR');
        setSelectedVoice('fr-FR_ReneeV3Voice');
      })
      .catch(err => console.error(err));
  }, []);

  const handleChangeText = (newText: string): void => {
    setText(newText);
  };

  const handleChangeSelectedLanguage = (newLanguage?: string) => {
    if (newLanguage) {
      setSelectedVoice('');
      setSelectedLanguage(newLanguage);
    }
  };

  const handleChangeSelectedVoice = (newVoice?: string) => {
    if (newVoice) setSelectedVoice(newVoice);
  };

  const speech = useCallback(async () => {
    if (!text) return;

    const pronunciationResult = await api.get('pronunciation', {
      params: {
        text: `${text}`,
        voice: `${selectedVoice}`,
        format: 'ipa',
      },
    });

    setPronunciation(pronunciationResult.data.pronunciation);

    const result = await api.get('synthesize', {
      params: {
        text: `${text}`,
        voice: `${selectedVoice}`,
        accept: 'audio/mp3',
      },
      responseType: 'blob',
    });
    const blob = URL.createObjectURL(result.data);
    const x = new Audio(blob);
    x.play();
  }, [text, selectedVoice]);

  return (
    <div className={classes.container}>
      <Typography variant="h4">How to Pronounce</Typography>

      <div className={classes.heroContainer}>
        <img src={hero} alt="Listen" className={classes.hero} />
        <Typography>Type a text to check how to pronounce it</Typography>
      </div>

      <FormControl className={classes.select}>
        <InputLabel id="language-selector">Language</InputLabel>
        <Select
          labelId="language-selector"
          id="language"
          value={selectedLanguage}
          onChange={event =>
            handleChangeSelectedLanguage(String(event.target.value))
          }
        >
          {Object.keys(voices).map(language => (
            <MenuItem key={language} value={language}>
              <ListItemIcon>
                <img
                  src={countryFlags[language as Voice['language']]}
                  alt="Flag"
                  className={classes.flag}
                />
              </ListItemIcon>
              <Typography variant="inherit">{language}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedLanguage && (
        <FormControl className={classes.select}>
          <InputLabel id="voice-selector">Voice</InputLabel>
          <Select
            labelId="voice-selector"
            id="voice"
            value={selectedVoice}
            onChange={event =>
              handleChangeSelectedVoice(String(event.target.value))
            }
          >
            {voices[selectedLanguage].map(voice => (
              <MenuItem key={voice.name} value={voice.name}>
                {voice.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Box display="flex" alignItems="center" mt={2}>
        <TextField
          type="text"
          label="Text"
          variant="outlined"
          onChange={event => handleChangeText(event.target.value)}
          className={classes.textField}
        />
        <IconButton onClick={speech}>
          <VolumeUpIcon />
        </IconButton>
      </Box>

      <Box mt={2}>
        <Typography variant="h5">{pronunciation}</Typography>
      </Box>
    </div>
  );
};

export default Landing;
