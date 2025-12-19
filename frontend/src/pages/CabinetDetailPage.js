import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Grid, List, ListItem, ListItemText, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CabinetDetailPage = () => {
  const { id } = useParams();
  const [cabinet, setCabinet] = useState(null);
  const [tools, setTools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCabinetDetails = async () => {
      try {
        const cabinetResponse = await axios.get(`http://localhost:5000/api/cabinets/${id}`);
        setCabinet(cabinetResponse.data);

        const toolsResponse = await axios.get(`http://localhost:5000/api/cabinets/${id}/tools`);
        setTools(toolsResponse.data);
      } catch (error) {
        console.error('Error fetching cabinet details:', error);
      }
    };

    fetchCabinetDetails();
  }, [id]);

  if (!cabinet) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6">Chargement...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {cabinet.name}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={cabinet.image_url || '/placeholder-cabinet.jpg'}
                alt={cabinet.name}
              />
              <CardContent>
                <Typography variant="body1" paragraph>
                  {cabinet.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Emplacement: {cabinet.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Outils dans cette armoire
                </Typography>
                <List>
                  {tools.map((tool) => (
                    <ListItem key={tool.id}>
                      <ListItemText
                        primary={tool.name}
                        secondary={`Quantité: ${tool.quantity}, Statut: ${tool.status}`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/check/${cabinet.id}`)}
                  >
                    Vérifier les outils manquants
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CabinetDetailPage;