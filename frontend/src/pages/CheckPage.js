import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, List, ListItem, ListItemText, CircularProgress, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';

const CheckPage = () => {
  const { id } = useParams();
  const [cabinet, setCabinet] = useState(null);
  const [tools, setTools] = useState([]);
  const [missingTools, setMissingTools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const webcamRef = useRef(null);

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

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraPermission('granted');
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        setCameraPermission('denied');
        setCameraError('Veuillez autoriser l\'accès à la caméra pour utiliser cette fonctionnalité.');
      }
    };

    requestCameraPermission();
  }, []);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };

  const analyzeImage = async () => {
    if (!imageSrc) return;

    setIsLoading(true);

    try {
      // Charger le modèle TensorFlow.js (à implémenter)
      await tf.ready();

      // Simuler une analyse d'image (à remplacer par une vraie implémentation)
      const simulatedMissingTools = tools.filter(tool => Math.random() > 0.7);
      setMissingTools(simulatedMissingTools);

      // Envoyer les résultats au backend
      await axios.post(`http://localhost:5000/api/checks`, {
        cabinetId: id,
        image: imageSrc,
        missingTools: simulatedMissingTools.map(tool => tool.id)
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          Vérification de l'armoire: {cabinet.name}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Capture d'image
                </Typography>
                {cameraPermission === 'denied' ? (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                    <Typography variant="body1" color="error">
                      Accès à la caméra refusé
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur pour utiliser cette fonctionnalité.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => window.location.reload()}
                      sx={{ mt: 2 }}
                    >
                      Réessayer
                    </Button>
                  </Box>
                ) : cameraPermission === null ? (
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="body1" color="info.main">
                      Demande d'accès à la caméra...
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Veuillez autoriser l'accès à la caméra pour continuer.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                      onUserMediaError={() => {
                        setCameraPermission('denied');
                        setCameraError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
                      }}
                    />
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={captureImage}
                  disabled={!!imageSrc}
                >
                  Capturer l'image
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Image capturée
                </Typography>
                {imageSrc ? (
                  <Box sx={{ mb: 2 }}>
                    <img
                      src={imageSrc}
                      alt="Captured"
                      style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                    />
                  </Box>
                ) : (
                  <Typography variant="body1">Aucune image capturée</Typography>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={analyzeImage}
                  disabled={!imageSrc || isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Analyser l\'image'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {missingTools.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Outils manquants détectés
                </Typography>
                <List>
                  {missingTools.map((tool) => (
                    <ListItem key={tool.id}>
                      <ListItemText
                        primary={tool.name}
                        secondary={`Quantité: ${tool.quantity}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CheckPage;