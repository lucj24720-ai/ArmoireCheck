import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CabinetListPage = () => {
  const [cabinets, setCabinets] = useState([]);
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCabinets = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        const response = await axios.get(`${backendUrl}/api/cabinets`);
        setCabinets(response.data);
      } catch (error) {
        console.error('Error fetching cabinets:', error);
        setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
      }
    };

    fetchCabinets();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Liste des armoires
        </Typography>
        {error && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        )}
        <Grid container spacing={4}>
          {cabinets.map((cabinet) => (
            <Grid item key={cabinet.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={cabinet.image_url || '/placeholder-cabinet.jpg'}
                  alt={cabinet.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {cabinet.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cabinet.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Emplacement: {cabinet.location}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/cabinets/${cabinet.id}`)}
                    >
                      Voir détails
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/check/${cabinet.id}`)}
                      sx={{ ml: 1 }}
                    >
                      Vérifier
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CabinetListPage;