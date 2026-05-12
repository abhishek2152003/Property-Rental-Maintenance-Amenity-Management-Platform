import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Divider,
  LinearProgress,
  Button,
  Chip,
} from "@mui/material";
import {
  HomeWork as PropertyIcon,
  Pool as PoolIcon,
  BuildCircle as MaintenanceIcon,
  EventAvailable as BookingIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { apiGetOwnerDashboardData } from "../api/dashboard";
import DashboardLayout from "../component/SideBar";

const tokens = {
  navy950: "#0A1628",
  navy900: "#0F2044",
  navy800: "#162B5B",
  navy700: "#1E3A72",
  blue600: "#1D4ED8",
  blue500: "#3B82F6",
  blue400: "#60A5FA",
  blue50: "#EFF6FF",
  emerald600: "#059669",
  emerald500: "#10B981",
  emerald50: "#ECFDF5",
  amber600: "#D97706",
  amber500: "#F59E0B",
  amber50: "#FFFBEB",
  slate900: "#0F172A",
  slate700: "#334155",
  slate500: "#64748B",
  slate300: "#CBD5E1",
  slate50: "#F8FAFC",
  white: "#FFFFFF",
  error: "#EF4444",
};

const PriorityBadge = ({ priority }) => {
  const configs = {
    High: { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
    Medium: { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D" },
    Low: { bg: "#E0E7FF", color: "#3730A3", border: "#A5B4FC" },
  };
  const config = configs[priority] || configs["Medium"];

  return (
    <Box sx={{
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: config.bg,
      color: config.color,
      px: 1.2,
      py: 0.5,
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      border: `1px solid ${config.border}`
    }}>
      {priority}
    </Box>
  );
};

const StatusBadge = ({ status }) => {
  const configs = {
    Completed: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
    "In Progress": { bg: "#DBEAFE", color: "#1E40AF", dot: "#3B82F6" },
    Pending: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
    confirmed: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
    cancelled: { bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
  };
  const config = configs[status] || configs["Pending"];

  return (
    <Box sx={{
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: config.bg,
      color: config.color,
      px: 1.5,
      py: 0.5,
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: 500,
      gap: 1
    }}>
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: config.dot }} />
      {status}
    </Box>
  );
};

export default function OwnerDashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiGetOwnerDashboardData(user.id);
      setData(res);
    } catch (error) {
      console.error("Error fetching owner dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchDashboard();
  }, [user?.id]);

  if (loading && !data) {
    return (
      <DashboardLayout pageTitle="Dashboard">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
          <CircularProgress sx={{ color: tokens.navy900 }} />
        </Box>
      </DashboardLayout>
    );
  }

  const stats = data?.stats || { totalProperties: 0, totalAmenities: 0, totalMaintenanceRequests: 0, totalBookings: 0 };

  const statsCards = [
    { title: "Total Properties", value: stats.totalProperties, change: "Manage units & tenants", icon: <PropertyIcon />, color: tokens.navy900 },
    { title: "Total Amenities", value: stats.totalAmenities, change: "Across all properties", icon: <PoolIcon />, color: tokens.emerald500 },
    { title: "Maintenance Requests", value: stats.totalMaintenanceRequests, change: `${data?.recentRequests?.filter(r => r.status === "Pending").length || 0} pending now`, icon: <MaintenanceIcon />, color: tokens.amber500 },
    { title: "Amenity Bookings", value: stats.totalBookings, change: "This month's activity", icon: <BookingIcon />, color: tokens.blue500 },
  ];

  return (
    <DashboardLayout pageTitle="Owner Dashboard">
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp 0.5s ease-out forwards; }
          .stagger-1 { animation-delay: 0.1s; }
          .stagger-2 { animation-delay: 0.2s; }
          .stagger-3 { animation-delay: 0.3s; }
        `}
      </style>

      <Box sx={{ p: 4, bgcolor: tokens.slate50, minHeight: "100vh", width: '100%' }}>

        {/* Row 1: Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 6, opacity: 0 }} className="fade-up stagger-1">
          {statsCards.map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{
                borderRadius: '18px',
                boxShadow: "0 2px 12px rgba(15,32,68,0.08)",
                transition: "all 0.2s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 30px rgba(15,32,68,0.12)" }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ pr: 5 }}>
                      <Typography sx={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: tokens.slate500, mb: 1 }}>
                        {stat.title}
                      </Typography>
                      <Typography sx={{ fontSize: "28px", fontWeight: 700, color: tokens.navy950, lineHeight: 1 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: `${stat.color}15`, color: stat.color, p: 1.5, borderRadius: '12px', display: 'flex' }}>
                      {React.cloneElement(stat.icon, { sx: { fontSize: 24 } })}
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: "12px", color: tokens.slate500 }}>
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Row 2: Recent Maintenance Requests (Full Width) */}
        <Box sx={{ mb: 6, opacity: 0 }} className="fade-up stagger-2">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontFamily: "Libre Baskerville", fontSize: "20px", fontWeight: 700, color: tokens.navy900 }}>
              Recent Maintenance Requests
            </Typography>

          </Box>

          <Card sx={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: "0 2px 12px rgba(15,32,68,0.08)" }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Request ID</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Property</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tenant</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Category</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Priority</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.recentRequests?.length === 0 ? (
                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>No recent maintenance requests.</TableCell></TableRow>
                  ) : (
                    data.recentRequests.map((req, idx) => (
                      <TableRow key={req._id} hover>
                        <TableCell sx={{ color: tokens.blue600, fontWeight: 600 }}>MNT-00{idx + 1}</TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, fontSize: '14px', color: tokens.navy950 }}>{req.propertyId?.name}</Typography>
                          <Typography sx={{ fontSize: '12px', color: tokens.slate500 }}>{req.description?.substring(0, 30)}...</Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px', color: tokens.slate700 }}>{req.userId?.username}</TableCell>
                        <TableCell>
                          <Chip label={req.category} size="small" sx={{ bgcolor: tokens.blue50, color: tokens.blue600, fontWeight: 600, fontSize: '11px' }} />
                        </TableCell>
                        <TableCell><PriorityBadge priority={req.priority || "Medium"} /></TableCell>
                        <TableCell><StatusBadge status={req.status} /></TableCell>
                        <TableCell sx={{ fontSize: '13px', color: tokens.slate500 }}>
                          {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>

        {/* Row 3: Recent Bookings (Full Width) */}
        <Box sx={{ mb: 6, opacity: 0 }} className="fade-up stagger-3">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontFamily: "Libre Baskerville", fontSize: "20px", fontWeight: 700, color: tokens.navy900 }}>
              Recent Bookings
            </Typography>
          </Box>

          <Card sx={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: "0 2px 12px rgba(15,32,68,0.08)" }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Booking ID</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amenity</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Property</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tenant</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Date</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Time</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.recentBookings?.length === 0 ? (
                    <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>No recent bookings.</TableCell></TableRow>
                  ) : (
                    data.recentBookings.map((booking, idx) => (
                      <TableRow key={booking._id} hover>
                        <TableCell sx={{ color: tokens.blue600, fontWeight: 600 }}>BKG-00{idx + 1}</TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 600, fontSize: '14px', color: tokens.navy950 }}>{booking.amenityId?.name}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: '14px', color: tokens.slate700 }}>{booking.propertyId?.name}</TableCell>
                        <TableCell sx={{ fontSize: '14px', color: tokens.slate700 }}>{booking.userId?.username}</TableCell>
                        <TableCell sx={{ fontSize: '13px', color: tokens.slate500 }}>
                          {new Date(booking.bookingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell sx={{ fontSize: '13px', color: tokens.slate500 }}>
                          {booking.checkInTime} - {booking.checkOutTime}
                        </TableCell>
                        <TableCell><StatusBadge status={booking.status} /></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>

        {/* Row 4: Properties Overview (Full Width) */}
        <Box sx={{ opacity: 0 }} className="fade-up stagger-3">
          <Typography sx={{ fontFamily: "Libre Baskerville", fontSize: "20px", fontWeight: 700, color: tokens.navy900, mb: 3 }}>
            Properties Overview
          </Typography>
          <Grid container spacing={3}>
            {(data?.properties || []).map((prop, idx) => (
              <Grid item xs={12} key={idx}>
                <Card sx={{ borderRadius: '18px', border: '1px solid #F1F5F9', boxShadow: "0 2px 12px rgba(15,32,68,0.08)" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <Typography sx={{ fontWeight: 700, color: tokens.navy950, fontSize: '16px', mb: 0.5 }}>{prop.name}</Typography>
                        <Typography sx={{ fontSize: '12px', color: tokens.slate500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon sx={{ fontSize: 14 }} /> {prop.address}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} md={2}>
                        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Units</Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 700, color: tokens.navy950, mt: 0.5 }}>{prop.totalUnits || 0}</Typography>
                      </Grid>

                      <Grid item xs={6} md={2}>
                        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tenants</Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 700, color: tokens.blue500, mt: 0.5 }}>{prop.tenantCount}</Typography>
                      </Grid>

                      <Grid item xs={6} md={2}>
                        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amenities</Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 700, color: tokens.emerald600, mt: 0.5 }}>{prop.amenityCount}</Typography>
                      </Grid>

                      <Grid item xs={6} md={2}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Requests</Typography>
                        <Typography sx={{ fontSize: '20px', fontWeight: 700, color: tokens.amber600, mt: 0.5 }}>{prop.activeRequestCount}</Typography>
                      </Grid>
                    </Grid>

                    {/* Occupancy Bar */}
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: tokens.slate500 }}>Occupancy Rate</Typography>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: tokens.blue600 }}>
                          {prop.totalUnits ? Math.round((prop.tenantCount / prop.totalUnits) * 100) : 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={prop.totalUnits ? (prop.tenantCount / prop.totalUnits) * 100 : 0}
                        sx={{ height: 6, borderRadius: 3, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: tokens.blue500 } }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
