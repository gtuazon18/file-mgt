import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, useMediaQuery, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', link: '/' },
    { text: 'Upload', link: '/upload' },
    { text: 'Admin Dashboard', link: '/admin-dashboard', role: 'admin' },
  ];

  return (
    <AppBar position="sticky">
      <Toolbar>
        {token && isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {token ? (
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              <HomeIcon sx={{ fontSize: 30, marginRight: 1 }} />
              Home
            </Link>
          ) : (
            <Typography variant="h6">File Management</Typography>
          )}
        </Typography>

        {token && role !== 'admin' && (
          <Button
            color="inherit"
            onClick={() => navigate('/upload')}
            startIcon={<UploadFileIcon />}
            sx={{ marginRight: 2 }}
          >
            Upload
          </Button>
        )}

        {token && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <List>
          {menuItems.map(
            (item) =>
              (!item.role || item.role === role) && (
                <ListItem button key={item.text} onClick={() => navigate(item.link)}>
                  <ListItemText primary={item.text} />
                </ListItem>
              )
          )}
          {token && (
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Header;
