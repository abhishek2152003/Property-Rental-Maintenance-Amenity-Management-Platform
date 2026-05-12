import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";

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

export default function LandingNavBar() {
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
    <Box
      component="nav"
      sx={{
        py: scrolled ? 2 : 3,
        px: { xs: 2, md: 8 },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${tokens.slate100}` : "none",
        transition: "all 0.3s ease",
        zIndex: 1000,
      }}
    >
      <Typography
        component="div"
        sx={{
          fontFamily: "Libre Baskerville",
          fontWeight: 700,
          fontSize: "26px",
          color: tokens.navy950,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
        onClick={() => navigate("/")}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: `linear-gradient(135deg, ${tokens.blue600}, ${tokens.blue400})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: tokens.white,
            fontSize: "18px",
          }}
        >
          P
        </Box>
        Prop<span style={{ color: tokens.blue500 }}>Flow</span>
      </Typography>

      <Stack direction="row" spacing={4} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
        {/* Navigation links removed */}
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button
          onClick={() => navigate("/login")}
          sx={{
            color: tokens.navy950,
            fontFamily: "DM Sans",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "15px",
            display: { xs: "none", sm: "block" },
            px: 3,
          }}
        >
          Sign In
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/signup")}
          sx={{
            backgroundColor: tokens.navy950,
            color: tokens.white,
            borderRadius: "14px",
            px: 4,
            py: 1.2,
            fontFamily: "DM Sans",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "15px",
            boxShadow: "0 10px 25px rgba(2, 6, 23, 0.15)",
            "&:hover": {
              backgroundColor: tokens.navy900,
              transform: "translateY(-2px)",
              boxShadow: "0 15px 30px rgba(2, 6, 23, 0.2)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Get Started Free
        </Button>
      </Stack>
    </Box>
  );
}
