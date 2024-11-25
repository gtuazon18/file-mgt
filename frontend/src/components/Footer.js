import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', p: 3, marginTop: 'auto' }}>
      <Typography variant="body2" color="textSecondary" align="center">
        &copy; 2024 File Management System. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
