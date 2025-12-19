import React from 'react';
import { Container, Typography, Box, Card, CardContent, Link } from '@mui/material';
import { SignIn } from '@clerk/clerk-react';

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom align="center">
              Connexion
            </Typography>

            <SignIn path="/login" routing="path" signUpUrl="/sign-up" />

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="/" variant="body2">
                Retour à l'accueil
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;