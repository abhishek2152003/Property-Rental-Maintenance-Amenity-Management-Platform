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
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Home as PropertyIcon,
  BuildCircle as MaintenanceIcon,
  EventAvailable as BookingIcon,
  Pool as PoolIcon,
  NotificationsOutlined as NotificationIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { apiGetTenantDashboardData } from "../api/dashboard";
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
  amber600: "#D97706",
  amber500: "#F59E0B",
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
    }}>
      {status}
    </Box>
  );
};

export default function TenantDashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await apiGetTenantDashboardData(user.id);
      setData(res);
    } catch (error) {
      console.error("Error fetching tenant dashboard:", error);
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

  const statsCards = [
    {
      title: "My Property",
      value: data?.property?.name || "Not Assigned",
      change: data?.property?.address || "Contact Owner",
      icon: <PropertyIcon />,
      color: tokens.navy900
    },
    {
      title: "Active Requests",
      value: data?.stats?.activeRequests || 0,
      change: "Open maintenance issues",
      icon: <MaintenanceIcon />,
      color: tokens.amber500
    },
    {
      title: "Total Bookings",
      value: data?.stats?.totalBookings || 0,
      change: "Upcoming & past activity",
      icon: <BookingIcon />,
      color: tokens.blue500
    },
    {
      title: "Amenities",
      value: data?.stats?.amenityCount || 0,
      change: "Available to book",
      icon: <PoolIcon />,
      color: tokens.emerald500
    },
  ];

  return (
    <DashboardLayout pageTitle="Tenant Dashboard">
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
          .stagger-4 { animation-delay: 0.4s; }
          /* Eliminate any hidden max-width constraints from MUI Containers */
          .MuiContainer-root { 
            max-width: none !important; 
            width: 100% !important; 
            padding: 0 !important; 
          }
        `}
      </style>

      <Box sx={{ p: 5, px: 5, bgcolor: tokens.slate50, minHeight: "100vh", width: '100%', maxWidth: 'none' }}>

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
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: tokens.slate500, mb: 1 }}>
                        {stat.title}
                      </Typography>
                      <Typography sx={{
                        fontSize: stat.value?.length > 15 ? "18px" : "28px",
                        fontWeight: 700,
                        color: tokens.navy950,
                        lineHeight: 1.1,
                        wordBreak: 'break-word'
                      }}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: "12px", color: tokens.slate500, mt: 1 }}>
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={6} sx={{ mb: 6, width: '100%' }}>
          {/* Recent Maintenance Requests */}
          <Grid item xs={12} md={6} sx={{ opacity: 0 }} className="fade-up stagger-2">
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontFamily: "Libre Baskerville", fontSize: "20px", fontWeight: 700, color: tokens.navy900 }}>
                Maintenance Requests
              </Typography>
            </Box>

            <Card sx={{
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid #F1F5F9',
              boxShadow: "0 2px 12px rgba(15,32,68,0.08)"
            }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: tokens.slate50 }}>
                    <TableRow>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, px: 5, width: '20%' }}>Category</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, px: 5, width: '50%' }}>Issue Description</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, px: 5, width: '15%' }}>Status</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, px: 5, textAlign: 'right', width: '15%' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.recentRequests?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 6, px: 5, color: tokens.slate400 }}>
                          No maintenance requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.recentRequests.map((req, idx) => (
                        <TableRow key={req._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ py: 2.5, px: 5 }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: tokens.navy900 }}>
                              {req.category}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <Typography sx={{ fontSize: '15px', color: tokens.navy950, fontWeight: 500, lineHeight: 1.5 }}>
                              {req.issueDescription || "No issue description provided"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <StatusBadge status={req.status} />
                          </TableCell>
                          <TableCell sx={{ py: 2.5, textAlign: 'right' }}>
                            <Typography sx={{ fontSize: '12px', color: tokens.slate500, fontWeight: 600 }}>
                              {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* Upcoming Activity (Bookings) */}
          <Grid item xs={12} md={6} sx={{ opacity: 0 }} className="fade-up stagger-3">
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontFamily: "Libre Baskerville", fontSize: "20px", fontWeight: 700, color: tokens.navy900 }}>
                Upcoming Activity
              </Typography>
            </Box>

            <Card sx={{
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid #F1F5F9',
              boxShadow: "0 2px 12px rgba(15,32,68,0.08)"
            }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: tokens.slate50 }}>
                    <TableRow>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, px: 5 }}>Amenity Name</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, px: 5 }}>Property Reference</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, px: 5 }}>Time Slot</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, px: 5 }}>Current Status</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: tokens.slate500, textTransform: 'uppercase', letterSpacing: '0.08em', py: 2, px: 5, textAlign: 'right' }}>Booking Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.recentBookings?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6, px: 5, color: tokens.slate400 }}>
                          No upcoming bookings.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.recentBookings.map((booking) => (
                        <TableRow key={booking._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ py: 2.5, px: 5 }}>
                            <Typography sx={{ fontSize: '15px', fontWeight: 700, color: tokens.navy950 }}>
                              {booking.amenityId?.name || "Facility Reservation"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <Typography sx={{ fontSize: '13px', color: tokens.slate600, fontWeight: 500 }}>
                              {booking.propertyId?.name || data?.property?.name || "Assigned Property"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <Typography sx={{ fontSize: '13px', color: tokens.blue700, fontWeight: 700, bgcolor: tokens.blue50, py: 0.5, px: 1, borderRadius: '6px', display: 'inline-block' }}>
                              {booking.checkInTime || "--:--"} - {booking.checkOutTime || "--:--"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2.5 }}>
                            <StatusBadge status={booking.status} />
                          </TableCell>
                          <TableCell sx={{ py: 2.5, textAlign: 'right' }}>
                            <Typography sx={{ fontSize: '13px', color: tokens.slate500, fontWeight: 700 }}>
                              {new Date(booking.bookingDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', weekday: 'short' })}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>

        {/* Row 3: Available Amenities */}
        <Box sx={{ opacity: 0, mt: 2 }} className="fade-up stagger-4">
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontFamily: "Libre Baskerville", fontSize: "20px", fontWeight: 700, color: tokens.navy900, mb: 0.5 }}>
              Available Amenities
            </Typography>
            <Typography sx={{ fontSize: '14px', color: tokens.slate500 }}>
              Discover and reserve top-tier facilities available at your property
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {data?.availableAmenities?.map((amenity, idx) => {
              const gradients = [
                "linear-gradient(135deg, #162B5B, #3B82F6)",
                "linear-gradient(135deg, #059669, #10B981)",
                "linear-gradient(135deg, #D97706, #F59E0B)",
                "linear-gradient(135deg, #7C3AED, #A78BFA)"
              ];
              const gradient = gradients[idx % gradients.length];

              return (
                <Grid item xs={12} sm={6} md={4} key={amenity._id}>
                  <Card sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #F1F5F9',
                    boxShadow: "0 2px 12px rgba(15,32,68,0.08)",
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: "all 0.2s ease",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 30px rgba(15,32,68,0.12)" }
                  }}>
                    <Box sx={{
                      height: '8px',
                      background: gradient
                    }} />
                    <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 700, color: tokens.blue500, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                        Property Amenity
                      </Typography>
                      <Typography sx={{ fontFamily: "Libre Baskerville", fontWeight: 700, fontSize: '18px', color: tokens.navy950, mb: 1 }}>
                        {amenity.name}
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: tokens.slate500, mb: 2 }}>
                        Access high-quality facilities directly at your residence.
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tokens.emerald500 }} />
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: tokens.emerald600 }}>Available</Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate("/tenant/bookings/add", { state: { amenityId: amenity._id } })}
                        sx={{
                          borderRadius: '9999px',
                          textTransform: 'none',
                          px: 2.5,
                          bgcolor: tokens.navy900,
                          "&:hover": { bgcolor: tokens.navy800 }
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
