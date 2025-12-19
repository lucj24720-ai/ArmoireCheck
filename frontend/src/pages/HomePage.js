import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 8, mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Bienvenue sur ArmoireCheck
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Gestion intelligente de vos armoires d'outillage
        </Typography>
        <Typography variant="body1" paragraph>
          ArmoireCheck vous permet de contrôler facilement le contenu de vos armoires d'outillage.
          Utilisez la reconnaissance d'images pour détecter les outils manquants après utilisation.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/cabinets')}
            sx={{ mr: 2 }}
          >
            Voir les armoires
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
          >
            Connexion
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;