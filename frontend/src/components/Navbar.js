import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ArmoireCheck
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Accueil
          </Button>

          {user && (
            <Button color="inherit" component={Link} to="/cabinets">
              Armoires
            </Button>
          )}

          {user && user.role === 'admin' && (
            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>
          )}

          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Déconnexion
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Connexion
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;