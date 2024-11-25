import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/register`, {
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Registration successful!");
      setError("");
      setFormData({ email: "", password: "", confirmPassword: "" });
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Registration;