import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Box, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Typography, Avatar, Button, IconButton,
  Card, CircularProgress, Menu, MenuItem, Chip
} from '@mui/material';
import { Add, MoreVert, Edit, Delete, LocationOn, HomeWork } from '@mui/icons-material';
import SideBar from "../component/SideBar";
import { jwtDecode } from "jwt-decode"; 
import axios from 'axios';
import { fetchUserProfile } from "../api/user";

// Design System Tokens
const theme = {
  colors: {
    navy900: '#0F2044',
    navy800: '#162B5B',
    slate50: '#F8FAFC',
    slate300: '#CBD5E1',
    slate500: '#64748B',
    slate700: '#334155',
    blue50: '#EFF6FF',
    error: '#EF4444',
    success: '#10B981',
    ownerBadge: '#F0FDF4',
    tenantBadge: '#EFF6FF'
  },
  radius: { lg: '18px', xl: '24px', full: '9999px' }
};

const PropertiesPage = () => {
  // MOCK USER ROLE - Replace with Auth Context
  // const user = { role: 'owner', id: 'ownner', propertyId: 'prop_001' }; 
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Initially null
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProp, setSelectedProp] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Derived state
  const isOwner = user?.role === 'owner';

  // Step 1: Decode Token on Mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        navigate("/login"); // Redirect if token is corrupted
      }
    } else {
      navigate("/login"); // Redirect if no token exists
    }
  }, [navigate]);

  // Step 2: Fetch Data once User is known
  useEffect(() => {
    if (!user) return; // Wait for Step 1 to finish

    const fetchProps = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        let propertyId = user.propertyId;
        if (!isOwner && !propertyId) {
          const profile = await fetchUserProfile(user.id);
          propertyId = profile.propertyId;
        }

        const url = isOwner 
          ? `http://localhost:7001/api/property/owner/${user.id}` 
          : `http://localhost:7001/api/property/${propertyId}`;
        
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProperties(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error("Failed to fetch properties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProps();
  }, [user, isOwner]);

  const handleActionClick = (event, prop) => {
    setAnchorEl(event.currentTarget);
    setSelectedProp(prop);
  };

  const handleDelete = async () => {
    if (!selectedProp) return;
    if (!window.confirm(`Remove ${selectedProp.name}?`)) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:7001/api/property/${selectedProp._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties((prev) => prev.filter((p) => p._id !== selectedProp._id));
    } catch (err) {
      alert("Error deleting property.");
    } finally {
      setIsDeleting(false);
      setAnchorEl(null);
    }
  };

  // Prevent rendering before user data is loaded
  if (!user) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  
  return (
    <SideBar>
      <Box sx={{ flexGrow: 1, p: '24px 32px', bgcolor: theme.colors.slate50, minHeight: '100vh' }}>
        
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          bgcolor: 'white', p: '16px 24px', borderRadius: theme.radius.lg, mb: 4,
          boxShadow: '0 1px 3px rgba(15,32,68,0.08)' 
        }}>
          <Box>
            <Typography sx={{ fontFamily: 'Libre Baskerville', fontSize: 24, fontWeight: 700, color: theme.colors.navy900 }}>
              {isOwner ? "My Real Estate Portfolio" : "My Residence"}
            </Typography>
            <Chip 
              label={user.role.toUpperCase()} 
              sx={{ 
                mt: 1, height: 20, fontSize: 10, fontWeight: 700,
                bgcolor: isOwner ? theme.colors.ownerBadge : theme.colors.tenantBadge,
                color: isOwner ? '#14532D' : '#162B5B',
                border: `1px solid ${isOwner ? '#BBF7D0' : '#BFDBFE'}`
              }} 
            />
          </Box>

          {isOwner && (
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={() => navigate("/owner/properties/add",{ state: { ownerId: user.id } })}
              sx={{ 
                bgcolor: theme.colors.navy800, borderRadius: theme.radius.full,
                px: 3, textTransform: 'none', fontFamily: 'DM Sans', fontWeight: 600,
                boxShadow: '0 4px 14px rgba(22,43,91,0.35)',
                '&:hover': { bgcolor: '#1E3A72', transform: 'translateY(-1px)' }
              }}
            >
              Register Property
            </Button>
          )}
        </Box>

        {/* Properties Table */}
        <Card sx={{ borderRadius: theme.radius.xl, boxShadow: '0 2px 12px rgba(15,32,68,0.08)', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: theme.colors.slate50 }}>
                <TableRow>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500, letterSpacing: '0.08em' }}>PROPERTY</TableCell>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500, letterSpacing: '0.08em' }}>LOCATION</TableCell>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500, letterSpacing: '0.08em' }}>TYPE</TableCell>
                  {isOwner && <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500, letterSpacing: '0.08em' }}>UNITS</TableCell>}
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} align="center"><CircularProgress size={30} sx={{ my: 4 }} /></TableCell></TableRow>
                ) : (
                  properties.map((prop) => (
                    <TableRow key={prop._id} sx={{ '&:hover': { bgcolor: theme.colors.blue50 }, transition: '0.15s' }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            variant="rounded" 
                            src={prop.image ? `http://localhost:7001/${prop.image}` : ""} 
                            sx={{ width: 50, height: 50, borderRadius: '12px', bgcolor: theme.colors.blue50 }}
                          >
                            <HomeWork sx={{ color: theme.colors.navy800 }} />
                          </Avatar>
                          <Typography sx={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 14, color: theme.colors.navy900 }}>
                            {prop.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: theme.colors.slate700 }}>
                          <LocationOn sx={{ fontSize: 16, mr: 0.5, color: theme.colors.slate500 }} />
                          <Typography sx={{ fontSize: 13, fontFamily: 'DM Sans' }}>{prop.address}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, color: theme.colors.slate500, fontFamily: 'DM Sans' }}>
                          {prop.type || 'Residential'}
                        </Typography>
                      </TableCell>
                      {isOwner && (
                        <TableCell>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: theme.colors.navy800 }}>
                            {prop.totalUnits || 0} Units
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell align="right">
                        {isOwner ? (
                          <IconButton onClick={(e) => handleActionClick(e, prop)}>
                            <MoreVert />
                          </IconButton>
                        ) : (
                          <Button 
                            size="small" 
                            sx={{ color: theme.colors.navy800, textTransform: 'none', fontSize: 12, fontWeight: 600 }}
                          >
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Management Menu (Owner Only) */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { borderRadius: '12px', minWidth: 160 } }}
        >
          <MenuItem 
            onClick={() => {
               // Navigate to edit page (Implementation depends on your routes)
               navigate(`/owner/properties/edit/${selectedProp?._id}`);
               setAnchorEl(null);
            }} 
            sx={{ fontSize: 13, gap: 1.5 }}
          >
            <Edit sx={{ fontSize: 18, color: theme.colors.slate500 }} /> Edit Listing
          </MenuItem>
          
          <MenuItem 
            onClick={handleDelete} // Linked to our new function
            disabled={isDeleting}
            sx={{ 
              fontSize: 13, 
              gap: 1.5, 
              color: isDeleting ? theme.colors.slate300 : theme.colors.error 
            }}
          >
            {isDeleting ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <Delete sx={{ fontSize: 18 }} />
            )}
            {isDeleting ? "Removing..." : "Remove Property"}
          </MenuItem>
        </Menu>
      </Box>
    </SideBar>
  );
};

export default PropertiesPage;