import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Typography, Button, TextField, Container, Paper, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(token, { password });
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Link might be expired.");
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

          <Typography
            sx={{
              fontFamily: "Libre Baskerville",
              fontWeight: 700,
              fontSize: "24px",
              color: "#0F2044",
              mb: 1,
            }}
          >
            Create New Password
          </Typography>
          <Typography
            sx={{
              fontFamily: "DM Sans",
              fontSize: "14px",
              color: "#64748B",
              mb: 3,
            }}
          >
            Please enter your new password below.
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
              New Password
            </Typography>
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              placeholder="••••••••"
              variant="outlined"
              size="small"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  fontFamily: "DM Sans",
                  "& fieldset": { border: "1.5px solid #CBD5E1" },
                  "&:hover fieldset": { borderColor: "#3B82F6" },
                  "&.Mui-focused fieldset": { borderColor: "#3B82F6" },
                },
              }}
            />

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
              Confirm Password
            </Typography>
            <TextField
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              placeholder="••••••••"
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
              {loading ? "Updating..." : "Reset Password"}
            </Button>
          </form>

          <Link
            component={RouterLink}
            to="/login"
            underline="none"
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#1D4ED8",
              fontFamily: "DM Sans",
            }}
          >
            Cancel
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}
