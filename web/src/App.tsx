import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import LandingWatson from 'pages/LandingWatson';

const App: React.FC = () => {
  return (
    <Container>
      <CssBaseline />
      <LandingWatson />
    </Container>
  );
};

export default App;
