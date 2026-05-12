import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Stack,
  Button,
  Paper,
} from "@mui/material";
import {
  PersonAdd,
  Home,
  CheckCircle,
  Search,
  Settings,
  Star,
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

const Step = ({ icon: Icon, title, description, index }) => (
  <Box sx={{ position: "relative", textAlign: "center", p: 2 }}>
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: "50%",
        backgroundColor: tokens.blue500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: tokens.white,
        fontSize: "28px",
        fontWeight: 700,
        mx: "auto",
        mb: 3,
        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
        zIndex: 2,
        position: "relative",
      }}
    >
      <Icon sx={{ fontSize: 32 }} />
    </Box>
    <Typography
      variant="h6"
      sx={{
        fontFamily: "Libre Baskerville",
        fontWeight: 700,
        color: tokens.navy950,
        mb: 1.5,
      }}
    >
      {title}
    </Typography>
    <Typography
      sx={{
        fontFamily: "DM Sans",
        fontSize: "15px",
        color: tokens.slate500,
        lineHeight: 1.6,
      }}
    >
      {description}
    </Typography>
  </Box>
);

export default function HowItWorks() {
  const [role, setRole] = useState("owner");

  const ownerSteps = [
    {
      icon: PersonAdd,
      title: "Register & Setup",
      description: "Create your account as an owner and set up your profile in minutes."
    },
    {
      icon: Home,
      title: "List Properties",
      description: "Add your properties, units, and amenities to the platform easily."
    },
    {
      icon: CheckCircle,
      title: "Manage Seamlessly",
      description: "Approve bookings, track maintenance, and communicate with tenants."
    }
  ];

  const tenantSteps = [
    {
      icon: Search,
      title: "Find Your Home",
      description: "Browse premium properties or join via an invitation from your landlord."
    },
    {
      icon: Settings,
      title: "Personalize",
      description: "Set up your preferences and start exploring available amenities."
    },
    {
      icon: Star,
      title: "Enjoy Living",
      description: "Book facilities, request maintenance, and stay updated with ease."
    }
  ];

  const currentSteps = role === "owner" ? ownerSteps : tenantSteps;

  return (
    <PublicLayout>
      <Box sx={{ py: 15, backgroundColor: tokens.white }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 12 }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Libre Baskerville",
                fontWeight: 700,
                fontSize: { xs: "36px", md: "52px" },
                color: tokens.navy950,
                mb: 3,
              }}
            >
              How it <span style={{ color: tokens.blue500 }}>Works</span>
            </Typography>
            <Typography
              sx={{
                fontFamily: "DM Sans",
                fontSize: "18px",
                color: tokens.slate500,
                mb: 6,
              }}
            >
              A simple process designed for both property owners and modern residents.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 10 }}>
              <Button
                variant={role === "owner" ? "contained" : "outlined"}
                onClick={() => setRole("owner")}
                sx={{
                  borderRadius: "99px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "16px",
                  backgroundColor: role === "owner" ? tokens.navy950 : "transparent",
                  borderColor: tokens.navy950,
                  color: role === "owner" ? tokens.white : tokens.navy950,
                  "&:hover": {
                    backgroundColor: role === "owner" ? tokens.navy900 : tokens.slate50,
                    borderColor: tokens.navy950,
                  }
                }}
              >
                For Owners
              </Button>
              <Button
                variant={role === "tenant" ? "contained" : "outlined"}
                onClick={() => setRole("tenant")}
                sx={{
                  borderRadius: "99px",
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: "16px",
                  backgroundColor: role === "tenant" ? tokens.navy950 : "transparent",
                  borderColor: tokens.navy950,
                  color: role === "tenant" ? tokens.white : tokens.navy950,
                  "&:hover": {
                    backgroundColor: role === "tenant" ? tokens.navy900 : tokens.slate50,
                    borderColor: tokens.navy950,
                  }
                }}
              >
                For Tenants
              </Button>
            </Stack>
          </Box>

          <Box sx={{ position: "relative" }}>
            {/* Connector line */}
            <Box
              sx={{
                position: "absolute",
                top: "40px",
                left: "15%",
                right: "15%",
                height: "2px",
                borderTop: `2px dashed ${tokens.slate300}`,
                display: { xs: "none", md: "block" },
                zIndex: 1,
              }}
            />

            <Grid container spacing={6}>
              {currentSteps.map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Step {...step} index={index} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Video/Image Placeholder Section */}
      <Box sx={{ py: 15, backgroundColor: tokens.slate50 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "300px", md: "450px" },
                  backgroundColor: tokens.white,
                  borderRadius: "32px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                  border: `1px solid ${tokens.slate100}`,
                }}
              >
                 <Typography sx={{ color: tokens.slate400, fontWeight: 700 }}>Interactive Demo Preview</Typography>
                 {/* Visual elements */}
                 <Box sx={{ position: "absolute", top: 20, left: 20, width: 60, height: 10, bgcolor: tokens.blue500, borderRadius: 5, opacity: 0.2 }} />
                 <Box sx={{ position: "absolute", bottom: 20, right: 20, width: 40, height: 40, bgcolor: tokens.blue500, borderRadius: "50%", opacity: 0.1 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "Libre Baskerville",
                  fontWeight: 700,
                  color: tokens.navy950,
                  mb: 3,
                }}
              >
                Experience the {role === "owner" ? "Owner" : "Tenant"} Dashboard
              </Typography>
              <Typography
                sx={{
                  fontFamily: "DM Sans",
                  fontSize: "17px",
                  color: tokens.slate500,
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                Our interface is designed to be intuitive and powerful. Manage everything from maintenance requests to amenity schedules without ever feeling overwhelmed.
              </Typography>
              <Stack spacing={2}>
                {[
                  "Real-time data synchronization",
                  "Intuitive navigation system",
                  "Mobile-responsive design",
                  "24/7 priority support access"
                ].map((item, i) => (
                  <Stack direction="row" spacing={2} key={i} alignItems="center">
                    <CheckCircle sx={{ color: tokens.blue500, fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 500, color: tokens.slate700 }}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PublicLayout>
  );
}
