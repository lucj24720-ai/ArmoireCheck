import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';

const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ArmoireCheck
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">
            Accueil
          </Button>

          <SignedIn>
            <Button color="inherit" component={Link} to="/cabinets">
              Armoires
            </Button>

            {user && user.publicMetadata?.role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
            )}

            <Button
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              {user ? (
                <>
                  <Avatar
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="body2">
                    {user.fullName || user.emailAddresses[0]?.emailAddress || 'Utilisateur'}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2">Compte</Typography>
              )}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  width: 200,
                },
              }}
            >
              <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
            </Menu>
          </SignedIn>

          <SignedOut>
            <Button color="inherit" component={Link} to="/login">
              Connexion
            </Button>
          </SignedOut>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;