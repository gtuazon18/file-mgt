import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  useMediaQuery,
  Container,
  styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  bgcolor: '#f5f5f5',
  p: 3,
  position: 'relative'
}));

const LoginForm = styled(Box)(({ theme }) => ({
  p: 4,
  bgcolor: 'white',
  boxShadow: 3,
  borderRadius: 2,
  width: '100%',
  zIndex: 1
}));

const BackgroundImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0.2,
  zIndex: 0,
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:400px)');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
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
    <LoginContainer>
      <BackgroundImage>
        <img src="https://picsum.photos/1920/1080" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </BackgroundImage>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <LoginForm>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              gutterBottom
              align="center"
            >
              Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

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
          </LoginForm>
        </Grid>
      </Grid>
    </LoginContainer>
  );
};

export default Login;