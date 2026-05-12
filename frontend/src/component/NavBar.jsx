import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Box, Typography, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { fetchUserProfile } from '../api/user';

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
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (e) { }
  }

  useEffect(() => {
    if (user?.id) {
      const loadProfile = async () => {
        try {
          const profile = await fetchUserProfile(user.id);
          if (profile.image) setProfileImage(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001'}/${profile.image}`);
          if (profile.username) setUserName(profile.username);
        } catch (err) {
          console.error("NavBar profile fetch fail", err);
        }
      };
      loadProfile();
    }
  }, [user?.id]);

  const role = user?.role?.toLowerCase() || "tenant";
  
  const displayUserName = userName || user?.username || "";
  const initials = displayUserName 
    ? displayUserName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) 
    : "??";

  const navLinks = role === "owner"
    ? [
      { name: 'Dashboard', path: '/owner/dashboard' },
      { name: 'Properties', path: '/owner/properties' },
      { name: 'Amenities', path: '/owner/amenities' },
    ]
    : [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Maintenance', path: '/tenant/maintenance' },
      { name: 'Bookings', path: '/tenant/bookings' },
    ];

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAnchorElUser(null);
    navigate("/");
  }

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
        onClick={() => navigate("/")}
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

      {/* 3. Actions & Auth */}
      <Box sx={{ display: 'flex', gap: { xs: '12px', md: '16px' }, alignItems: 'center' }}>

        {!token ? (
          <>
            <Button
              onClick={() => navigate("/login")}
              sx={{
                color: tokens.navy900,
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '14px',
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/signup")}
              sx={{
                backgroundColor: tokens.navy800,
                color: tokens.white,
                borderRadius: '9999px',
                px: 3,
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(22,43,91,0.3)',
                '&:hover': { backgroundColor: tokens.navy700 }
              }}
            >
              Get Started
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/dashboard")}
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
                '&:hover': { backgroundColor: tokens.navy700 },
              }}
            >
              Dashboard
            </Button>

            <Avatar
              onClick={handleOpenUserMenu}
              src={profileImage}
              sx={{
                width: { xs: 32, md: 36 },
                height: { xs: 32, md: 36 },
                background: profileImage ? 'transparent' : `linear-gradient(135deg, ${tokens.navy700}, ${tokens.blue500})`,
                color: tokens.white,
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: '"DM Sans", sans-serif',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              {!profileImage && initials}
            </Avatar>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  mt: 1,
                  minWidth: '150px',
                  boxShadow: '0 10px 30px rgba(15,32,68,0.12)',
                  p: 0.5
                }
              }}
            >
              <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/profile"); }} sx={{ fontSize: '14px', fontFamily: '"DM Sans"', fontWeight: 500, borderRadius: '8px' }}>
                👤 My Profile
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ fontSize: '14px', fontFamily: '"DM Sans"', fontWeight: 500, borderRadius: '8px', color: '#EF4444' }}>
                🚪 Logout
              </MenuItem>
            </Menu>
          </>
        )}

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
            {navLinks.map((link) => (
              <MenuItem
                key={link.name}
                onClick={() => { handleCloseNavMenu(); navigate(link.path); }}
                sx={{
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
            ))}
            {!token && (
              <MenuItem onClick={() => { handleCloseNavMenu(); navigate("/login"); }} sx={{ mt: 1 }}>
                <Button fullWidth variant="contained" sx={{ backgroundColor: tokens.navy800, color: tokens.white, borderRadius: '9999px', textTransform: 'none', fontWeight: 600 }}>
                  Login
                </Button>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Box>
    </Box>
  );
}
