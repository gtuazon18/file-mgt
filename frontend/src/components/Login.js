import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert, Grid, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Use Material-UI's useMediaQuery to handle responsive design
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); // Store user role
      if (res.data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/upload');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={3}
    >
      {/* Grid container for responsive form */}
      <Grid container justifyContent="center">
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Box
            p={4}
            bgcolor="white"
            boxShadow={3}
            borderRadius={2}
            width="100%"
          >
            {/* Title that scales on different screen sizes */}
            <Typography 
              variant={isMobile ? 'h5' : 'h4'} 
              component="h1" 
              gutterBottom 
              align="center"
            >
              Login
            </Typography>
            
            {/* Show error alert if any */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                variant="outlined"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
