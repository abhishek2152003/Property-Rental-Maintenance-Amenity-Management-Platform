import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  IconButton, Menu, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { Add, MoreVert, Delete, Visibility, Apartment, Edit } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { useConfirm } from '../context/ConfirmContext';
import SideBar from "../component/SideBar";
import { fetchAllBookings, fetchUserBookings, fetchPropertyBookings, deleteBooking } from "../api/bookings";
import { fetchOwnerProperties } from "../api/property";
import { fetchUserProfile } from "../api/user";

const theme = {
  colors: {
    navy900: '#0F2044',
    navy800: '#162B5B',
    slate50: '#F8FAFC',
    slate500: '#64748B',
    success: '#10B981',
    error: '#EF4444',
    blue50: '#EFF6FF',
  },
  radius: { lg: '18px', xl: '24px', full: '9999px' }
};

const BookingsPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  // Auth & Role logic
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [loading, setLoading] = useState(false);

  // Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsOwner(decoded.role?.toLowerCase() === 'owner');

      // For tenants, always fetch profile to get the latest propertyId
      if (decoded.role?.toLowerCase() === 'tenant') {
        const getProfile = async () => {
          try {
            const userProfile = await fetchUserProfile(decoded.id);
            if (userProfile && userProfile.propertyId) {
              setSelectedProperty(userProfile.propertyId);
              // Update user state locally
              setUser(prev => ({ ...prev, propertyId: userProfile.propertyId }));
            }
          } catch (err) {
            console.error("Error fetching user profile for propertyId:", err);
            toast.error("Failed to load user profile");
          }
        };
        getProfile();
      }
    }
  }, []);

  useEffect(() => {
    if (user && isOwner) {
      const loadProperties = async () => {
        try {
          const res = await fetchOwnerProperties(user.id);
          const props = res.data || [];
          setProperties(props);
          if (props.length > 0) {
            setSelectedProperty(props[0]._id);
          }
        } catch (err) {
          console.error("Error fetching properties:", err);
        }
      };
      loadProperties();
    } else if (user && !isOwner) {
      // For tenants, use their assigned property
      setSelectedProperty(user.propertyId || '');
    }
  }, [user, isOwner]);

  const loadData = async () => {
    if (!selectedProperty && (isOwner || !user?.propertyId)) {
      if (!isOwner) setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchPropertyBookings(selectedProperty);
      setBookings(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProperty) {
      loadData();
    }
  }, [selectedProperty]);

  const handleMenuOpen = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;

    const confirmed = await confirm({
      title: "Cancel Booking",
      message: "Are you sure you want to cancel/delete this booking? This action cannot be undone.",
      confirmLabel: "Cancel Booking",
      isDanger: true
    });

    if (!confirmed) {
      handleMenuClose();
      return;
    }

    try {
      await deleteBooking(selectedBooking._id);
      // Optimistic UI update
      setBookings(prev => prev.filter(b => b._id !== selectedBooking._id));
      toast.success("Booking deleted successfully");
    } catch (err) {
      toast.error("Delete failed: " + (err.response?.data?.message || "Server error"));
    } finally {
      handleMenuClose();
    }
  };

  return (
    <SideBar>
      <Box sx={{ flexGrow: 1, p: '24px 32px', bgcolor: theme.colors.slate50, minHeight: '100vh' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box>
              <Typography sx={{ fontFamily: 'Libre Baskerville', fontSize: 24, fontWeight: 700, color: theme.colors.navy900 }}>
                {isOwner ? "Amenity Management" : "Community Bookings"}
              </Typography>
              <Typography sx={{ fontSize: 12, color: theme.colors.slate500, fontWeight: 600 }}>
                VIEWING AS: {user?.role?.toUpperCase() || 'USER'}
              </Typography>
            </Box>

            {/* Property Selector for Owners */}
            {isOwner && properties.length > 0 && (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="property-select-label">Select Property</InputLabel>
                <Select
                  labelId="property-select-label"
                  value={selectedProperty}
                  label="Select Property"
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  sx={{
                    borderRadius: '10px',
                    bgcolor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' }
                  }}
                >
                  {properties.map(prop => (
                    <MenuItem key={prop._id} value={prop._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Apartment sx={{ fontSize: 18, color: theme.colors.slate500 }} />
                        {prop.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          {!isOwner && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/tenant/bookings/add")}
                sx={{
                  bgcolor: theme.colors.navy800,
                  borderRadius: theme.radius.full,
                  textTransform: 'none',
                  px: 3,
                  '&:hover': { bgcolor: theme.colors.navy900 }
                }}
              >
                Book Amenity
              </Button>
            </Box>
          )}
        </Box>

        {/* Data Table */}
        <Card sx={{ borderRadius: theme.radius.xl, boxShadow: '0 2px 12px rgba(15,32,68,0.08)', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: theme.colors.slate50 }}>
                <TableRow>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500 }}>AMENITY</TableCell>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500 }}>USER ROLE</TableCell>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500 }}>DATE</TableCell>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500 }}>TIME</TableCell>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500 }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: theme.colors.slate500 }}>No bookings found.</TableCell></TableRow>
                ) : (
                  bookings.map((row) => (
                    <TableRow key={row._id} sx={{ '&:hover': { bgcolor: theme.colors.blue50 } }}>
                      <TableCell sx={{ fontWeight: 600, color: theme.colors.navy900 }}>
                        {row.amenityId?.name || "Deleted Amenity"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.userId?.role?.toUpperCase() || "TENANT"}
                          size="small"
                          sx={{
                            bgcolor: row.userId?.role === 'owner' ? '#DBEAFE' : '#F1F5F9',
                            color: row.userId?.role === 'owner' ? '#1E40AF' : '#475569',
                            fontWeight: 600, borderRadius: '4px', fontSize: '10px'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.slate500 }}>
                        {new Date(row.bookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                        {row.checkInTime} - {row.checkOutTime}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.status.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: row.status === 'confirmed' ? '#D1FAE5' : '#FEF2F2',
                            color: row.status === 'confirmed' ? '#065F46' : '#991B1B',
                            fontWeight: 700, borderRadius: '6px', fontSize: '10px'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{ sx: { borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 150 } }}
        >
          {!isOwner && (
            <MenuItem
              onClick={() => {
                navigate(`/tenant/bookings/edit/${selectedBooking?._id}`);
                handleMenuClose();
              }}
              sx={{ fontSize: 14, gap: 1 }}
            >
              <Edit sx={{ fontSize: 18, color: theme.colors.slate500 }} /> Edit Booking
            </MenuItem>
          )}
          {!isOwner && (
            <MenuItem onClick={handleDelete} sx={{ fontSize: 14, gap: 1, color: theme.colors.error }}>
              <Delete sx={{ fontSize: 18 }} /> Cancel Booking
            </MenuItem>
          )}
        </Menu>
      </Box>
    </SideBar>
  );
};

export default BookingsPage;