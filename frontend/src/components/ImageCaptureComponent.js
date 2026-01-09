/**
 * Composant de capture d'image avec webcam
 * Permet de prendre des photos pour la vérification des armoires
 */

import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  RestartAlt as RestartIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const ImageCaptureComponent = ({ onImageCapture, referenceImage }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Configuration de la webcam
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment' // Utiliser la caméra arrière sur mobile
  };

  // Capturer une image
  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setCapturedImage(imageSrc);
          setError(null);
        } else {
          setError('Failed to capture image. Please try again.');
        }
      } catch (err) {
        console.error('Error capturing image:', err);
        setError('Error capturing image. Please try again.');
      }
    }
  }, []);

  // Réinitialiser la capture
  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  // Confirmer et utiliser l'image
  const handleConfirm = useCallback(async () => {
    if (capturedImage && onImageCapture) {
      try {
        setIsProcessing(true);
        await onImageCapture(capturedImage);
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Error processing image. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  }, [capturedImage, onImageCapture]);

  // Gestion des erreurs webcam
  const handleUserMediaError = useCallback((error) => {
    console.error('Webcam error:', error);
    let errorMessage = 'Unable to access camera. ';

    if (error.name === 'NotAllowedError') {
      errorMessage += 'Please allow camera access in your browser settings.';
    } else if (error.name === 'NotFoundError') {
      errorMessage += 'No camera found on this device.';
    } else if (error.name === 'NotReadableError') {
      errorMessage += 'Camera is being used by another application.';
    } else {
      errorMessage += 'Please check your camera connection.';
    }

    setError(errorMessage);
  }, []);

  return (
    <Box>
      {/* Image de référence */}
      {referenceImage && (
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Reference Image
          </Typography>
          <Box
            component="img"
            src={referenceImage}
            alt="Reference"
            sx={{
              width: '100%',
              maxHeight: 300,
              objectFit: 'contain',
              borderRadius: 1
            }}
          />
        </Paper>
      )}

      {/* Zone de capture */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {capturedImage ? 'Captured Image' : 'Camera View'}
        </Typography>

        {/* Affichage des erreurs */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Webcam ou image capturée */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 640,
            mx: 'auto',
            backgroundColor: '#000',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          {capturedImage ? (
            // Afficher l'image capturée
            <Box
              component="img"
              src={capturedImage}
              alt="Captured"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          ) : (
            // Afficher la webcam
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={() => setIsWebcamReady(true)}
                onUserMediaError={handleUserMediaError}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />

              {/* Indicateur de chargement */}
              {!isWebcamReady && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <CircularProgress sx={{ color: 'white' }} />
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Starting camera...
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Boutons d'action */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          {capturedImage ? (
            <>
              <Button
                variant="outlined"
                startIcon={<RestartIcon />}
                onClick={handleReset}
                disabled={isProcessing}
              >
                Retake
              </Button>
              <Button
                variant="contained"
                startIcon={isProcessing ? <CircularProgress size={20} /> : <CheckIcon />}
                onClick={handleConfirm}
                disabled={isProcessing}
                color="success"
              >
                {isProcessing ? 'Processing...' : 'Confirm'}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<CameraIcon />}
              onClick={handleCapture}
              disabled={!isWebcamReady}
              size="large"
            >
              Capture Photo
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Instructions */}
      <Alert severity="info">
        <Typography variant="body2">
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" component="div">
          <ul style={{ marginTop: 8, marginBottom: 0 }}>
            <li>Ensure good lighting for better detection</li>
            <li>Position the camera to show the entire cabinet</li>
            <li>Hold the camera steady when capturing</li>
            <li>Make sure all tools are visible</li>
          </ul>
        </Typography>
      </Alert>
    </Box>
  );
};

export default ImageCaptureComponent;
