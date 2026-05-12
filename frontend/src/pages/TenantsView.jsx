import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Avatar, Button, IconButton,
  Card, CircularProgress, Menu, MenuItem, Chip
} from '@mui/material';
import { Add, MoreVert, Delete, Person, HomeWork } from '@mui/icons-material';
import SideBar from "../component/SideBar";
import { jwtDecode } from "jwt-decode";
import { apiGetTenantsByOwner, apiRemoveTenant } from "../api/user";

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

import { toast } from 'react-toastify';
import { useConfirm } from '../context/ConfirmContext';

const TenantsView = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Step 1: Decode Token on Mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== 'owner' && decoded.role !== 'admin') {
          navigate("/dashboard");
          return;
        }
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Step 2: Fetch Data
  useEffect(() => {
    if (!user) return;

    const fetchTenants = async () => {
      try {
        setLoading(true);
        const data = await apiGetTenantsByOwner(user.id);
        setTenants(data.tenants || []);
      } catch (err) {
        console.error("Failed to fetch tenants", err);
        toast.error("Failed to fetch tenants list");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [user]);

  const handleActionClick = (event, tenant) => {
    setAnchorEl(event.currentTarget);
    setSelectedTenant(tenant);
  };
  const handleRemove = async () => {
    if (!selectedTenant) return;
    const confirmed = await confirm({
      title: "Unlink Tenant",
      message: `Are you sure you want to unlink ${selectedTenant.username} from their property?`,
      confirmLabel: "Unlink",
      isDanger: true
    });
    if (!confirmed) return;

    try {
      setIsRemoving(true);
      await apiRemoveTenant(selectedTenant._id);
      setTenants((prev) => prev.filter((t) => t._id !== selectedTenant._id));
      toast.success("Tenant unlinked successfully.");
    } catch (err) {
      console.error("Error removing tenant:", err);
      toast.error("Failed to unlink tenant: " + (err.response?.data?.message || err.message));
    } finally {
      setIsRemoving(false);
      setAnchorEl(null);
    }
  };

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
              Tenant Management
            </Typography>
            <Typography sx={{ fontSize: 13, color: theme.colors.slate500, fontFamily: 'DM Sans', mt: 0.5 }}>
              Manage residents across your properties
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/owner/tenants/add")}
            sx={{
              bgcolor: theme.colors.navy800, borderRadius: theme.radius.full,
              px: 3, textTransform: 'none', fontFamily: 'DM Sans', fontWeight: 600,
              boxShadow: '0 4px 14px rgba(22,43,91,0.35)',
              '&:hover': { bgcolor: '#1E3A72', transform: 'translateY(-1px)' }
            }}
          >
            Add Tenant
          </Button>
        </Box>

        {/* Tenants Table */}
        <Card sx={{ borderRadius: theme.radius.xl, boxShadow: '0 2px 12px rgba(15,32,68,0.08)', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: theme.colors.slate50 }}>
                <TableRow>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500, letterSpacing: '0.08em' }}>TENANT</TableCell>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500, letterSpacing: '0.08em' }}>CONTACT</TableCell>
                  <TableCell sx={{ fontSize: 11, fontWeight: 600, color: theme.colors.slate500, letterSpacing: '0.08em' }}>ASSIGNED PROPERTY</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} align="center"><CircularProgress size={30} sx={{ my: 4 }} /></TableCell></TableRow>
                ) : tenants.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center"><Box sx={{ py: 6, color: theme.colors.slate500 }}>No active tenants found for your properties.</Box></TableCell></TableRow>
                ) : (
                  tenants.map((tenant) => (
                    <TableRow key={tenant._id} sx={{ '&:hover': { bgcolor: theme.colors.blue50 }, transition: '0.15s' }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={tenant.image ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001'}/${tenant.image}` : ""}
                            sx={{ width: 40, height: 40, bgcolor: theme.colors.blue50 }}
                          >
                            <Person sx={{ color: theme.colors.navy800 }} />
                          </Avatar>
                          <Typography sx={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 14, color: theme.colors.navy900 }}>
                            {tenant.username}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography sx={{ fontSize: 13, fontFamily: 'DM Sans', color: theme.colors.slate700 }}>{tenant.email}</Typography>
                          <Typography sx={{ fontSize: 12, color: theme.colors.slate500 }}>{tenant.phone || "No phone added"}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HomeWork sx={{ fontSize: 16, color: theme.colors.slate500 }} />
                          <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: theme.colors.navy800 }}>
                              {tenant.propertyId?.name || "Unknown Property"}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: theme.colors.slate500 }}>
                              {tenant.propertyId?.address || ""}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleActionClick(e, tenant)}>
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

        {/* Management Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { borderRadius: '12px', minWidth: 160 } }}
        >
          <MenuItem
            onClick={handleRemove}
            disabled={isRemoving}
            sx={{
              fontSize: 13,
              gap: 1.5,
              color: isRemoving ? theme.colors.slate300 : theme.colors.error
            }}
          >
            {isRemoving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <Delete sx={{ fontSize: 18 }} />
            )}
            {isRemoving ? "Removing..." : "Remove from Property"}
          </MenuItem>
        </Menu>
      </Box>
    </SideBar>
  );
};

export default TenantsView;
