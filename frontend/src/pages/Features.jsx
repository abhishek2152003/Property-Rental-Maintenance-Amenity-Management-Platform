import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import {
  HomeWork,
  Build,
  EventAvailable,
  Security,
  NotificationsActive,
  Assessment,
} from "@mui/icons-material";
import PublicLayout from "../component/PublicLayout";

const tokens = {
  navy950: "#020617",
  blue600: "#2563EB",
  blue500: "#3B82F6",
  slate700: "#334155",
  slate500: "#64748B",
  slate100: "#F1F5F9",
  slate50: "#F8FAFC",
  white: "#FFFFFF",
};

const FeatureItem = ({ icon: Icon, title, description, delay }) => (
  <Paper
    elevation={0}
    sx={{
      p: 5,
      height: "100%",
      borderRadius: "32px",
      backgroundColor: tokens.white,
      border: `1px solid ${tokens.slate100}`,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      "&:hover": {
        transform: "translateY(-12px)",
        boxShadow: "0 30px 60px rgba(15,23,42,0.08)",
        borderColor: tokens.blue500,
        "& .icon-box": {
          backgroundColor: tokens.blue500,
          color: tokens.white,
        },
      },
    }}
  >
    <Box
      className="icon-box"
      sx={{
        width: 64,
        height: 64,
        borderRadius: "20px",
        backgroundColor: tokens.slate50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: tokens.blue500,
        mb: 3,
        transition: "all 0.3s ease",
      }}
    >
      <Icon sx={{ fontSize: 32 }} />
    </Box>
    <Typography
      variant="h5"
      sx={{
        fontFamily: "Libre Baskerville",
        fontWeight: 700,
        color: tokens.navy950,
        mb: 2,
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontFamily: "DM Sans",
        fontSize: "16px",
        lineHeight: 1.7,
        color: tokens.slate500,
      }}
    >
      {description}
    </Typography>
  </Paper>
);

export default function Features() {
  const features = [
    {
      icon: HomeWork,
      title: "Property Portfolio",
      description: "Manage multiple properties from a single dashboard. Real-time availability and detailed property insights for owners.",
      delay: 0.1
    },
    {
      icon: Build,
      title: "Smart Maintenance",
      description: "End-to-end maintenance tracking. Tenants can upload photos, and owners can assign tasks to service providers.",
      delay: 0.2
    },
    {
      icon: EventAvailable,
      title: "Amenity Booking",
      description: "Seamlessly book gyms, pools, and community halls. Integrated calendar ensures no double bookings.",
      delay: 0.3
    },
    {
      icon: Security,
      title: "Secure Access",
      description: "Role-based access control for owners and tenants. Your data is protected with industry-standard encryption.",
      delay: 0.4
    },
    {
      icon: NotificationsActive,
      title: "Instant Alerts",
      description: "Get notified about booking confirmations, maintenance updates, and community announcements instantly.",
      delay: 0.5
    },
    {
      icon: Assessment,
      title: "Advanced Analytics",
      description: "Detailed reports on occupancy rates, maintenance costs, and amenity usage for optimized management.",
      delay: 0.6
    }
  ];

  return (
    <PublicLayout>
      <Box sx={{ py: 15, backgroundColor: tokens.slate50 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 12 }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Libre Baskerville",
                fontWeight: 700,
                fontSize: { xs: "40px", md: "56px" },
                color: tokens.navy950,
                mb: 3,
              }}
            >
              Powerful Features for <br />
              <span style={{ color: tokens.blue500 }}>Seamless Management</span>
            </Typography>
            <Typography
              sx={{
                fontFamily: "DM Sans",
                fontSize: "18px",
                color: tokens.slate500,
                maxWidth: "700px",
                mx: "auto",
                lineHeight: 1.8,
              }}
            >
              Everything you need to manage your property portfolio or enhance your living experience, all in one premium platform.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureItem {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Hero-like CTA at bottom */}
      <Box sx={{ py: 15, backgroundColor: tokens.white }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: { xs: 5, md: 8 },
              borderRadius: "40px",
              background: `linear-gradient(135deg, ${tokens.navy950}, ${tokens.navy900})`,
              color: tokens.white,
              textAlign: "center",
              boxShadow: "0 40px 100px rgba(2, 6, 23, 0.2)",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: "Libre Baskerville",
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: "32px", md: "42px" }
              }}
            >
              Ready to experience the future?
            </Typography>
            <Typography sx={{ mb: 6, opacity: 0.8, fontSize: "18px" }}>
              Join thousands of owners and tenants who have simplified their property management.
            </Typography>
            <Stack direction="row" spacing={3} justifyContent="center">
              <button
                style={{
                  padding: "16px 40px",
                  borderRadius: "16px",
                  backgroundColor: tokens.blue500,
                  color: tokens.white,
                  border: "none",
                  fontWeight: 700,
                  fontSize: "17px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                Start Free Trial
              </button>
            </Stack>
          </Paper>
        </Container>
      </Box>

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </PublicLayout>
  );
}
