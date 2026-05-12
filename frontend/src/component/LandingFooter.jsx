import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import {
  VerifiedUser,
  SupportAgent,
} from "@mui/icons-material";

const tokens = {
  navy950: "#020617",
  blue500: "#3B82F6",
  slate700: "#334155",
  slate500: "#64748B",
  slate400: "#94A3B8",
  slate300: "#CBD5E1",
  slate100: "#F1F5F9",
  slate50: "#F8FAFC",
  white: "#FFFFFF",
};

export default function LandingFooter() {
  const navigate = useNavigate();

  return (
    <Box sx={{ borderTop: `1px solid ${tokens.slate100}`, py: 12, backgroundColor: tokens.slate50 }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Typography
              sx={{
                fontFamily: "Libre Baskerville",
                fontWeight: 700,
                fontSize: "24px",
                color: tokens.navy950,
                mb: 3,
                cursor: "pointer"
              }}
              onClick={() => navigate("/")}
            >
              Prop<span style={{ color: tokens.blue500 }}>Flow</span>
            </Typography>
            <Typography sx={{ color: tokens.slate500, lineHeight: 1.7, mb: 4 }}>
              A modern ecosystem for premium property management. Built for the next generation of owners and tenants.
            </Typography>
            <Stack direction="row" spacing={2}>
              <VerifiedUser sx={{ color: tokens.blue500 }} />
              <SupportAgent sx={{ color: tokens.blue500 }} />
            </Stack>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography sx={{ fontWeight: 700, mb: 3 }}>Resources</Typography>
            {[
              { name: "Support", path: "#" },
              { name: "Community", path: "#" }
            ].map((item) => (
              <Typography 
                key={item.name} 
                onClick={() => item.path !== "#" && navigate(item.path)}
                sx={{ color: tokens.slate500, mb: 1.5, fontSize: "14px", cursor: "pointer", "&:hover": { color: tokens.blue500 } }}
              >
                {item.name}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography sx={{ fontWeight: 700, mb: 3 }}>Company</Typography>
            {["About", "Careers", "Press", "Contact"].map((item) => (
              <Typography key={item} sx={{ color: tokens.slate500, mb: 1.5, fontSize: "14px", cursor: "pointer" }}>{item}</Typography>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontWeight: 700, mb: 3 }}>Stay Updated</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box
                component="input"
                placeholder="Enter email"
                sx={{
                  flexGrow: 1,
                  px: 2,
                  py: 1.5,
                  borderRadius: "12px",
                  border: `1px solid ${tokens.slate300}`,
                  outline: "none",
                  fontFamily: "DM Sans",
                }}
              />
              <Button variant="contained" sx={{ bgcolor: tokens.navy950, color: tokens.white, borderRadius: "12px", "&:hover": { bgcolor: tokens.slate700 } }}>Join</Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography sx={{ fontFamily: "DM Sans", fontSize: "14px", color: tokens.slate400 }}>
            © 2026 PropFlow Technologies Inc. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={4}>
            <Typography sx={{ fontFamily: "DM Sans", fontSize: "14px", color: tokens.slate700, cursor: "pointer" }}>Privacy</Typography>
            <Typography sx={{ fontFamily: "DM Sans", fontSize: "14px", color: tokens.slate700, cursor: "pointer" }}>Terms</Typography>
            <Typography sx={{ fontFamily: "DM Sans", fontSize: "14px", color: tokens.slate700, cursor: "pointer" }}>Security</Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
