import React, { useState } from "react";
import { toast } from "react-toastify";
import { Box, Typography, Button, TextField, Container, Paper, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      toast.success(res.data.message);
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#F8FAFC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "24px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 16px rgba(15,32,68,0.10)",
            textAlign: "center"
          }}
        >
          {/* Logo */}
          <Typography
            sx={{
              fontFamily: "Libre Baskerville",
              fontWeight: 700,
              fontSize: "20px",
              color: "#0F2044",
              mb: 3,
            }}
          >
            Prop<span style={{ color: "#60A5FA" }}>Flow</span>
          </Typography>

          {!isSubmitted ? (
            <>
              <Typography
                sx={{
                  fontFamily: "Libre Baskerville",
                  fontWeight: 700,
                  fontSize: "24px",
                  color: "#0F2044",
                  mb: 1,
                }}
              >
                Forgot Password?
              </Typography>
              <Typography
                sx={{
                  fontFamily: "DM Sans",
                  fontSize: "14px",
                  color: "#64748B",
                  mb: 3,
                }}
              >
                No worries! Enter your email and we'll send you a reset link.
              </Typography>

              <form onSubmit={handleSubmit}>
                <Typography
                  sx={{
                    fontFamily: "DM Sans",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#64748B",
                    textAlign: "left",
                    mb: 1,
                  }}
                >
                  Email
                </Typography>
                <TextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  placeholder="name@company.com"
                  variant="outlined"
                  size="small"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                      fontFamily: "DM Sans",
                      "& fieldset": { border: "1.5px solid #CBD5E1" },
                      "&:hover fieldset": { borderColor: "#3B82F6" },
                      "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    backgroundColor: "#162B5B",
                    color: "#FFFFFF",
                    borderRadius: "9999px",
                    py: "10px",
                    fontFamily: "DM Sans",
                    fontSize: "14px",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(22,43,91,0.35)",
                    "&:hover": { backgroundColor: "#1E3A72" },
                    mb: 2
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          ) : (
            <Box sx={{ py: 2 }}>
              <Typography
                sx={{
                  fontFamily: "Libre Baskerville",
                  fontWeight: 700,
                  fontSize: "22px",
                  color: "#0F2044",
                  mb: 2,
                }}
              >
                Check your Email
              </Typography>
              <Typography
                sx={{
                  fontFamily: "DM Sans",
                  fontSize: "15px",
                  color: "#64748B",
                  mb: 4,
                }}
              >
                If an account exists for <b>{email}</b>, you will receive a password reset link shortly.
              </Typography>
            </Box>
          )}

          <Link
            component={RouterLink}
            to="/login"
            underline="none"
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#1D4ED8",
              fontFamily: "DM Sans",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1
            }}
          >
            ← Back to Login
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}
