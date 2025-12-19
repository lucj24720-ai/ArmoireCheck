import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, Button, TextField, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const AdminPage = () => {
  const [cabinets, setCabinets] = useState([]);
  const [tools, setTools] = useState([]);
  const [users, setUsers] = useState([]);
  const [openCabinetDialog, setOpenCabinetDialog] = useState(false);
  const [openToolDialog, setOpenToolDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [newCabinet, setNewCabinet] = useState({ name: '', description: '', location: '' });
  const [newTool, setNewTool] = useState({ cabinetId: '', name: '', description: '', quantity: 1 });
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cabinetsResponse = await axios.get('http://localhost:5000/api/cabinets');
      setCabinets(cabinetsResponse.data);

      const toolsResponse = await axios.get('http://localhost:5000/api/tools');
      setTools(toolsResponse.data);

      const usersResponse = await axios.get('http://localhost:5000/api/users');
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddCabinet = async () => {
    try {
      await axios.post('http://localhost:5000/api/cabinets', newCabinet);
      setOpenCabinetDialog(false);
      setNewCabinet({ name: '', description: '', location: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding cabinet:', error);
    }
  };

  const handleAddTool = async () => {
    try {
      await axios.post('http://localhost:5000/api/tools', newTool);
      setOpenToolDialog(false);
      setNewTool({ cabinetId: '', name: '', description: '', quantity: 1 });
      fetchData();
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/users', newUser);
      setOpenUserDialog(false);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
      fetchData();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tableau de bord Administrateur
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Gestion des armoires
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenCabinetDialog(true)}>
            Ajouter une armoire
          </Button>
          <List>
            {cabinets.map((cabinet) => (
              <ListItem key={cabinet.id}>
                <ListItemText primary={cabinet.name} secondary={cabinet.location} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Gestion des outils
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenToolDialog(true)}>
            Ajouter un outil
          </Button>
          <List>
            {tools.map((tool) => (
              <ListItem key={tool.id}>
                <ListItemText primary={tool.name} secondary={`Armoire: ${tool.cabinet_id}, Quantité: ${tool.quantity}`} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Gestion des utilisateurs
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpenUserDialog(true)}>
            Ajouter un utilisateur
          </Button>
          <List>
            {users.map((user) => (
              <ListItem key={user.id}>
                <ListItemText primary={user.username} secondary={`Email: ${user.email}, Rôle: ${user.role}`} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Dialog open={openCabinetDialog} onClose={() => setOpenCabinetDialog(false)}>
          <DialogTitle>Ajouter une armoire</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom"
              fullWidth
              value={newCabinet.name}
              onChange={(e) => setNewCabinet({ ...newCabinet, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              value={newCabinet.description}
              onChange={(e) => setNewCabinet({ ...newCabinet, description: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Emplacement"
              fullWidth
              value={newCabinet.location}
              onChange={(e) => setNewCabinet({ ...newCabinet, location: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCabinetDialog(false)}>Annuler</Button>
            <Button onClick={handleAddCabinet}>Ajouter</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openToolDialog} onClose={() => setOpenToolDialog(false)}>
          <DialogTitle>Ajouter un outil</DialogTitle>
          <DialogContent>
            <TextField
              select
              margin="dense"
              label="Armoire"
              fullWidth
              value={newTool.cabinetId}
              onChange={(e) => setNewTool({ ...newTool, cabinetId: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">Sélectionnez une armoire</option>
              {cabinets.map((cabinet) => (
                <option key={cabinet.id} value={cabinet.id}>{cabinet.name}</option>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Nom"
              fullWidth
              value={newTool.name}
              onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              value={newTool.description}
              onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Quantité"
              type="number"
              fullWidth
              value={newTool.quantity}
              onChange={(e) => setNewTool({ ...newTool, quantity: parseInt(e.target.value) || 1 })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenToolDialog(false)}>Annuler</Button>
            <Button onClick={handleAddTool}>Ajouter</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)}>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nom d'utilisateur"
              fullWidth
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Mot de passe"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <TextField
              select
              margin="dense"
              label="Rôle"
              fullWidth
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUserDialog(false)}>Annuler</Button>
            <Button onClick={handleAddUser}>Ajouter</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminPage;