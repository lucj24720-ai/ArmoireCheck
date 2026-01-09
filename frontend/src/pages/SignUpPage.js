import React from 'react';
import { Container, Typography, Box, Card, CardContent, Link } from '@mui/material';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom align="center">
              Inscription
            </Typography>

            <SignUp path="/sign-up" routing="path" signInUrl="/login" />

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="/login" variant="body2">
                Déjà un compte ? Connectez-vous
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SignUpPage;