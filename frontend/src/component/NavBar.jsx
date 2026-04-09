import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Box, Typography, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const tokens = {
  navy950: '#0A1628',
  navy900: '#0F2044',
  navy800: '#162B5B',
  navy700: '#1E3A72',
  blue600: '#1D4ED8',
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  blue300: '#93C5FD',
  blue100: '#DBEAFE',
  blue50: '#EFF6FF',
  slate900: '#0F172A',
  slate700: '#334155',
  slate500: '#64748B',
  slate300: '#CBD5E1',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  white: '#FFFFFF',
};

export default function FloatingTopNav() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  let role = "tenant";
  if (token) {
    try {
      role = jwtDecode(token).role.toLowerCase();
    } catch (e) {}
  }

  const navLinks = role === "owner" 
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Properties', path: '/owner/propertyview' },
        { name: 'Amenities', path: '/owner/amenityview' },
      ]
    : [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Maintenance', path: '/tenant/maintenanceview' },
        { name: 'Bookings', path: '/tenant/bookingview' },
      ];

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box
      component="nav"
      sx={{
        // --- TRUE FLOATING POSITIONING ---
        position: 'fixed',
        top: { xs: '16px', md: '24px' }, // Distance from top
        left: '50%', // Move to horizontal center
        transform: 'translateX(-50%)', // Perfectly center it
        zIndex: 1100, // Stay above all content
        
        // --- SIZING ---
        width: { xs: 'calc(100% - 32px)', md: 'calc(100% - 48px)' },
        maxWidth: '1200px', // Keeps it a neat "pill" shape on large screens
        
        // --- DESIGN TOKENS ---
        backgroundColor: tokens.white,
        borderRadius: '18px',
        boxShadow: '0 12px 40px rgba(15,32,68,0.14)', // Deep floating shadow
        padding: { xs: '12px 16px', md: '16px 24px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* 1. Logo */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Libre Baskerville", serif',
          fontSize: { xs: '16px', md: '18px' },
          fontWeight: 700,
          color: tokens.navy900,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        Prop<span style={{ color: tokens.blue500 }}>Flow</span>
      </Typography>

      {/* 2. Desktop Links */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '8px' }}>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Box
              key={link.name}
              onClick={() => navigate(link.path)}
              sx={{
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                color: isActive ? tokens.navy800 : tokens.slate700,
                backgroundColor: isActive ? tokens.blue50 : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: tokens.blue50,
                  color: tokens.navy800,
                },
              }}
            >
              {link.name}
            </Box>
          );
        })}
      </Box>

      {/* 3. Actions & Mobile Menu */}
      <Box sx={{ display: 'flex', gap: { xs: '12px', md: '16px' }, alignItems: 'center' }}>
        
        {/* Desktop Action Button */}
        <Button
          variant="contained"
          size="small"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            backgroundColor: tokens.navy800,
            color: tokens.white,
            borderRadius: '9999px',
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'none',
            fontFamily: '"DM Sans", sans-serif',
            boxShadow: '0 4px 14px rgba(22,43,91,0.35)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: tokens.navy700,
              transform: 'translateY(-1px)',
            },
          }}
        >
          + New Request
        </Button>
        
        {/* Avatar */}
        <Avatar
          sx={{
            width: { xs: 32, md: 36 },
            height: { xs: 32, md: 36 },
            background: `linear-gradient(135deg, ${tokens.navy700}, ${tokens.blue500})`,
            color: tokens.white,
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: '"DM Sans", sans-serif',
            cursor: 'pointer',
          }}
        >
          AJ
        </Avatar>

        {/* Mobile Hamburger Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            onClick={handleOpenNavMenu}
            sx={{ color: tokens.navy900, p: 0 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Menu
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiPaper-root': {
                borderRadius: '16px',
                mt: 2,
                boxShadow: '0 12px 40px rgba(15,32,68,0.14)',
                minWidth: '200px',
                p: 1,
              }
            }}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
              <MenuItem 
                key={link.name} 
                onClick={() => { handleCloseNavMenu(); navigate(link.path); }}
                sx={{
                  backgroundColor: isActive ? tokens.blue50 : 'transparent',
                  color: isActive ? tokens.navy800 : tokens.slate700,
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  mb: 0.5,
                  '&:hover': { backgroundColor: tokens.blue50 }
                }}
              >
                {link.name}
              </MenuItem>
              );
            })}
            <MenuItem sx={{ display: { xs: 'block', sm: 'none' }, pt: 1, pb: 0, px: 0 }}>
              <Button fullWidth variant="contained" sx={{ backgroundColor: tokens.navy800, color: tokens.white, borderRadius: '9999px', textTransform: 'none', fontWeight: 600 }}>
                + New Request
              </Button>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}