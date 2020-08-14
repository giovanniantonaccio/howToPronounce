import React, { useCallback, useState, useEffect } from 'react';

import api from 'services/api';

const Landing: React.FC = () => {
  const [text, setText] = useState('');

  const handleChangeText = (newText: string): void => {
    setText(newText);
  };

  const handleTextToSpeech = useCallback(async () => {
    try {
      console.log('aqio');
      const audioPath = await api.get(`/textToSpeech?text=${text}`);
      const audioResult = await api.get(`files/${audioPath.data}`, {
        headers: { 'Content-Type': 'audio/mpeg' },
        responseType: 'blob',
      });
      console.log(audioResult.data);
      const blob = URL.createObjectURL(audioResult.data);
      console.log(blob);
      const sound = new Audio(blob);
      sound.play();
    } catch (err) {
      console.log(err);
    }
  }, [text]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>How to Pronounce</h1>
      <label htmlFor="textInput">Text</label>
      <input
        type="text"
        id="textInput"
        onChange={event => handleChangeText(event.target.value)}
      />
      <button onClick={handleTextToSpeech}>Ouvir</button>
    </div>
  );
};

export default Landing;
