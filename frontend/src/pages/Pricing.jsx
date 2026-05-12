import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
} from "@mui/icons-material";
import PublicLayout from "../component/PublicLayout";

const tokens = {
  navy950: "#020617",
  navy900: "#0F172A",
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
};

const PricingCard = ({ title, price, description, features, popular, delay }) => (
  <Paper
    elevation={0}
    sx={{
      p: 5,
      height: "100%",
      borderRadius: "32px",
      backgroundColor: tokens.white,
      border: popular ? `2px solid ${tokens.blue500}` : `1px solid ${tokens.slate100}`,
      position: "relative",
      transition: "all 0.4s ease",
      animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      "&:hover": {
        transform: "translateY(-12px)",
        boxShadow: "0 30px 60px rgba(15,23,42,0.08)",
      },
    }}
  >
    {popular && (
      <Box
        sx={{
          position: "absolute",
          top: -16,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: tokens.blue500,
          color: tokens.white,
          px: 3,
          py: 0.5,
          borderRadius: "99px",
          fontSize: "12px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Most Popular
      </Box>
    )}
    <Typography
      variant="h6"
      sx={{
        fontFamily: "DM Sans",
        fontWeight: 700,
        color: tokens.slate700,
        mb: 1,
      }}
    >
      {title}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
      <Typography variant="h3" sx={{ fontWeight: 800, color: tokens.navy950, fontFamily: "DM Sans" }}>
        {price}
      </Typography>
      <Typography sx={{ color: tokens.slate500, ml: 1, fontWeight: 500 }}>/month</Typography>
    </Box>
    <Typography
      sx={{
        fontFamily: "DM Sans",
        fontSize: "15px",
        color: tokens.slate500,
        mb: 4,
        minHeight: "44px"
      }}
    >
      {description}
    </Typography>
    
    <Divider sx={{ mb: 4 }} />

    <Stack spacing={2} sx={{ mb: 6 }}>
      {features.map((feature, i) => (
        <Stack direction="row" spacing={2} key={i} alignItems="center">
          <CheckCircle sx={{ color: tokens.blue500, fontSize: 18 }} />
          <Typography sx={{ fontSize: "14px", color: tokens.slate700, fontWeight: 500 }}>{feature}</Typography>
        </Stack>
      ))}
    </Stack>

    <Button
      fullWidth
      variant={popular ? "contained" : "outlined"}
      sx={{
        py: 2,
        borderRadius: "16px",
        fontWeight: 700,
        textTransform: "none",
        fontSize: "16px",
        backgroundColor: popular ? tokens.navy950 : "transparent",
        borderColor: tokens.navy950,
        color: popular ? tokens.white : tokens.navy950,
        "&:hover": {
          backgroundColor: popular ? tokens.navy900 : tokens.slate50,
          borderColor: tokens.navy950,
        }
      }}
    >
      Choose {title}
    </Button>
  </Paper>
);

export default function Pricing() {
  const plans = [
    {
      title: "Starter",
      price: "$29",
      description: "Perfect for single property owners just getting started.",
      features: [
        "Up to 5 rental units",
        "Basic maintenance tracking",
        "Amenity booking system",
        "Standard support",
        "Mobile app access"
      ],
      popular: false,
      delay: 0.1
    },
    {
      title: "Professional",
      price: "$79",
      description: "Ideal for growing portfolios and professional managers.",
      features: [
        "Up to 50 rental units",
        "Advanced maintenance workflows",
        "Automated booking reminders",
        "Priority email support",
        "Detailed analytics reports",
        "Multiple owner seats"
      ],
      popular: true,
      delay: 0.2
    },
    {
      title: "Enterprise",
      price: "$199",
      description: "Comprehensive solutions for large-scale property ecosystems.",
      features: [
        "Unlimited rental units",
        "Custom service provider portal",
        "White-label options",
        "24/7 dedicated support",
        "API access & integrations",
        "Advanced security features"
      ],
      popular: false,
      delay: 0.3
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
              Plans that scale with <br />
              <span style={{ color: tokens.blue500 }}>Your Ambition</span>
            </Typography>
            <Typography
              sx={{
                fontFamily: "DM Sans",
                fontSize: "18px",
                color: tokens.slate500,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              Simple, transparent pricing for every stage of your property management journey.
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <PricingCard {...plan} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Preview Section */}
      <Box sx={{ py: 15, backgroundColor: tokens.white }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h4" sx={{ fontFamily: "Libre Baskerville", fontWeight: 700, color: tokens.navy950, mb: 2 }}>
              Frequently Asked Questions
            </Typography>
            <Typography sx={{ color: tokens.slate500 }}>Everything you need to know about PropFlow pricing.</Typography>
          </Box>
          
          <Stack spacing={4}>
             {[
               { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan at any time from your account settings." },
               { q: "Is there a free trial?", a: "We offer a 14-day full-access free trial for all our plans. No credit card required." },
               { q: "Do you offer custom enterprise pricing?", a: "Absolutely. Contact our sales team for a custom quote tailored to your specific needs." }
             ].map((faq, i) => (
               <Box key={i}>
                 <Typography sx={{ fontWeight: 700, color: tokens.navy950, mb: 1, fontSize: "18px" }}>{faq.q}</Typography>
                 <Typography sx={{ color: tokens.slate500, lineHeight: 1.7 }}>{faq.a}</Typography>
               </Box>
             ))}
          </Stack>
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
