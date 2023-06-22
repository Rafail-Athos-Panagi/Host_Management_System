import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import "./Navbar.css"
import Username from '../../hooks/user-context';


export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { username } = useContext(Username);
  const navigate = useNavigate();
  const handleLogout = () => {
    setAnchorEl(null);
    navigate("/logout");
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate("/account");
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="navbar">
      <div>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {username}
          </Typography>
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleAccount}>My account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </Box>
  );
}
