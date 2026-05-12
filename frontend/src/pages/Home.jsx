import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  IconButton,
  Avatar,
  Divider,
} from "@mui/material";
import {
  KeyboardArrowRight,
  TrendingUp,
  VerifiedUser,
  SupportAgent,
  CheckCircleOutline,
  PlayArrow,
} from "@mui/icons-material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import BuildIcon from "@mui/icons-material/Build";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import LandingNavBar from "../component/LandingNavBar";
import LandingFooter from "../component/LandingFooter";

import heroImage from "../assets/hero_v2.png";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/libre-baskerville/700.css";

const tokens = {
  navy950: "#020617",
  navy900: "#0F172A",
  navy800: "#1E293B",
  blue600: "#2563EB",
  blue500: "#3B82F6",
  blue400: "#60A5FA",
  slate700: "#334155",
  slate500: "#64748B",
  slate400: "#94A3B8",
  slate300: "#CBD5E1",
  slate100: "#F1F5F9",
  slate50: "#F8FAFC",
  white: "#FFFFFF",
  glass: "rgba(255, 255, 255, 0.7)",
};

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      height: "100%",
      borderRadius: "32px",
      backgroundColor: tokens.white,
      border: `1px solid ${tokens.slate100}`,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      overflow: "hidden",
      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      "&:hover": {
        transform: "translateY(-12px)",
        boxShadow: "0 30px 60px rgba(15,23,42,0.08)",
        borderColor: "transparent",
        "& .icon-box": {
          backgroundColor: tokens.blue500,
          color: tokens.white,
          transform: "rotate(10deg) scale(1.1)",
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
      variant="h6"
      sx={{
        fontFamily: "Libre Baskerville",
        fontWeight: 700,
        fontSize: "22px",
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

const StepCard = ({ number, title, description }) => (
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
        fontFamily: "DM Sans",
        mx: "auto",
        mb: 3,
        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {number}
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

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box sx={{ backgroundColor: tokens.white, minHeight: "100vh", overflowX: "hidden" }}>
      <LandingNavBar />

        {/* --- HERO SECTION --- */}
        <Box sx={{ position: "relative", pt: { xs: 8, md: 15 }, pb: { xs: 10, md: 20 } }}>
          {/* Background blobs */}
          <Box
            sx={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: "600px",
              height: "600px",
              background: `radial-gradient(circle, ${tokens.blue500} 0%, transparent 70%)`,
              opacity: 0.05,
              filter: "blur(80px)",
              zIndex: -1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "10%",
              left: "-5%",
              width: "500px",
              height: "500px",
              background: `radial-gradient(circle, ${tokens.blue600} 0%, transparent 70%)`,
              opacity: 0.03,
              filter: "blur(80px)",
              zIndex: -1,
            }}
          />

          <Container maxWidth="xl" sx={{ px: { md: 8 } }}>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ animation: "fadeInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 2,
                      py: 1,
                      borderRadius: "99px",
                      backgroundColor: "rgba(59, 130, 246, 0.08)",
                      border: `1px solid rgba(59, 130, 246, 0.15)`,
                      mb: 4,
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 18, color: tokens.blue500 }} />
                    <Typography
                      sx={{
                        fontFamily: "DM Sans",
                        fontWeight: 600,
                        fontSize: "13px",
                        color: tokens.blue600,
                        letterSpacing: "0.02em",
                      }}
                    >
                      TRUSTED BY 500+ PROPERTY OWNERS
                    </Typography>
                  </Box>
                  <Typography
                    variant="h1"
                    sx={{
                      fontFamily: "Libre Baskerville",
                      fontWeight: 700,
                      fontSize: { xs: "48px", md: "72px" },
                      lineHeight: 1.05,
                      color: tokens.navy950,
                      mb: 3,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    The Future of <br />
                    <span
                      style={{
                        background: `linear-gradient(90deg, ${tokens.blue600}, ${tokens.blue400})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Modern
                    </span>{" "}
                    Living.
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "DM Sans",
                      fontSize: "20px",
                      color: tokens.slate500,
                      lineHeight: 1.7,
                      mb: 6,
                      maxWidth: "540px",
                    }}
                  >
                    A premium management ecosystem for rentals, maintenance, and community amenities.
                    Efficiency meets elegance.
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/signup")}
                      endIcon={<KeyboardArrowRight />}
                      sx={{
                        backgroundColor: tokens.blue600,
                        color: tokens.white,
                        borderRadius: "16px",
                        px: 6,
                        py: 2,
                        fontFamily: "DM Sans",
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "17px",
                        boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)",
                        "&:hover": {
                          backgroundColor: tokens.blue500,
                          transform: "translateY(-3px)",
                          boxShadow: "0 25px 50px rgba(37, 99, 235, 0.4)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Get Started Now
                    </Button>
                    <Button
                      size="large"
                      onClick={() => navigate("/login")}
                      startIcon={<PlayArrow />}
                      sx={{
                        color: tokens.navy950,
                        borderRadius: "16px",
                        px: 4,
                        py: 2,
                        fontFamily: "DM Sans",
                        fontWeight: 700,
                        textTransform: "none",
                        fontSize: "17px",
                        border: `2px solid ${tokens.slate100}`,
                        "&:hover": {
                          backgroundColor: tokens.slate50,
                          borderColor: tokens.slate300,
                          transform: "translateY(-3px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: "relative",
                    animation: "fadeInRight 1s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "15%",
                      right: "-10%",
                      width: "120%",
                      height: "80%",
                      background: `linear-gradient(135deg, ${tokens.blue500} 0%, transparent 100%)`,
                      borderRadius: "40px",
                      opacity: 0.1,
                      zIndex: -1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={heroImage}
                    alt="Premium Living"
                    sx={{
                      width: "100%",
                      borderRadius: "40px",
                      boxShadow: "0 40px 100px rgba(0,0,0,0.12)",
                      animation: "floating 6s ease-in-out infinite",
                    }}
                  />
                  {/* Floating stats card */}
                  <Paper
                    elevation={0}
                    sx={{
                      position: "absolute",
                      bottom: "10%",
                      left: "-15%",
                      p: 3,
                      borderRadius: "24px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${tokens.white}`,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      display: { xs: "none", lg: "block" },
                      animation: "floating 5s ease-in-out infinite alternate",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: tokens.blue500 }}>
                        <CheckCircleOutline />
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: "18px", color: tokens.navy950 }}>99.9%</Typography>
                        <Typography sx={{ fontSize: "12px", color: tokens.slate500 }}>Uptime Guarantee</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* --- STATS SECTION --- */}
        <Box sx={{ pb: 15 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ width: "100%", textAlign: "center" }}>
              {[
                { label: "Active Units", value: "24k+" },
                { label: "Owner Rating", value: "4.9/5" },
                { label: "Bookings Daily", value: "2,500+" },
                { label: "Global Presence", value: "12+" },
              ].map((stat, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: tokens.navy950, mb: 1, fontFamily: "DM Sans" }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ color: tokens.slate500, fontWeight: 500, fontSize: "14px" }}>
                    {stat.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* --- FEATURES SECTION --- */}
        <Box sx={{ backgroundColor: tokens.slate50, py: 18, position: "relative" }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 10 }}>
              <Typography
                sx={{
                  fontFamily: "Libre Baskerville",
                  fontWeight: 700,
                  fontSize: { xs: "36px", md: "48px" },
                  color: tokens.navy950,
                  mb: 3,
                }}
              >
                Tailored for Modern Luxury
              </Typography>
              <Typography
                sx={{
                  fontFamily: "DM Sans",
                  fontSize: "18px",
                  color: tokens.slate500,
                  maxWidth: "640px",
                  mx: "auto",
                  lineHeight: 1.7,
                }}
              >
                PropFlow combines sophisticated technology with intuitive design to serve owners and tenants alike.
              </Typography>
            </Box>
            <Grid container spacing={5}>
              {[
                {
                  icon: HomeWorkIcon,
                  title: "Property Portfolio",
                  description: "Effortlessly list, browse, and manage rental properties with high-resolution details and real-time availability.",
                },
                {
                  icon: BuildIcon,
                  title: "Smart Maintenance",
                  description: "Submit maintenance requests with photos and track progress in real-time. Direct communication with service managers.",
                },
                {
                  icon: EventAvailableIcon,
                  title: "Amenity Booking",
                  description: "Book gyms, community halls, or swimming pools instantly. Manage your schedule and get reminders automatically.",
                },
              ].map((feature, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <FeatureCard {...feature} index={i} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* --- HOW IT WORKS --- */}
        <Box sx={{ py: 18 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 12 }}>
              <Typography
                sx={{
                  fontFamily: "Libre Baskerville",
                  fontWeight: 700,
                  fontSize: "42px",
                  color: tokens.navy950,
                  mb: 2,
                }}
              >
                Simple. Automated. Seamless.
              </Typography>
              <Typography sx={{ color: tokens.slate500, fontSize: "16px" }}>Experience the transition in three simple steps</Typography>
            </Box>

            <Box sx={{ position: "relative" }}>
              {/* Connector line */}
              <Box
                sx={{
                  position: "absolute",
                  top: "40px",
                  left: "10%",
                  right: "10%",
                  height: "2px",
                  borderTop: `2px dashed ${tokens.slate300}`,
                  display: { xs: "none", md: "block" },
                  zIndex: 1,
                }}
              />

              <Grid container spacing={6}>
                <Grid item xs={12} md={4}>
                  <StepCard
                    number="01"
                    title="Create Profile"
                    description="Register in seconds as an Owner or Tenant. Join the community instantly."
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StepCard
                    number="02"
                    title="Connect"
                    description="List your properties or get invited to your building's digital dashboard."
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <StepCard
                    number="03"
                    title="Experience"
                    description="Start booking amenities and managing maintenance with 24/7 visibility."
                  />
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>


        {/* --- FOOTER --- */}
        <LandingFooter />

        {/* --- ANIMATIONS --- */}
        <style>
          {`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}
        </style>
      </Box>
    );
}
