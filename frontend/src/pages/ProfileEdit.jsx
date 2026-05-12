import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, Avatar, Card, CardContent,
  Grid, IconButton, CircularProgress, Alert, Divider
} from "@mui/material";
import { PhotoCamera, Save, ArrowBack, VerifiedUser as VerifiedIcon, Security as SecurityIcon, Key as KeyIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SideBar from "../component/SideBar";
import { fetchUserProfile, updateProfile, apiChangePassword } from "../api/user";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const theme = {
  colors: {
    navy950: '#0A1628',
    navy900: '#0F2044',
    navy800: '#162B5B',
    slate50: '#F8FAFC',
    slate100: '#F1F5F9',
    slate500: '#64748B',
    blue500: '#3B82F6',
    blue50: '#EFF6FF',
    green500: '#10B981',
  },
  radius: { lg: '18px', xl: '24px', full: '9999px' }
};

const ProfileEdit = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    image: null,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [preview, setPreview] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No active session");

        const decoded = jwtDecode(token);
        const uId = decoded.id;
        setUserId(uId);
        setRole(decoded.role || "User");

        const user = await fetchUserProfile(uId);
        setFormData({
          username: user.username,
          email: user.email,
          phone: user.phone || "",
        });
        if (user.image) setPreview(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001'}/${user.image}`);
      } catch (err) {
        toast.error("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append("username", formData.username);
    data.append("phone", formData.phone);
    if (formData.image) data.append("image", formData.image);

    try {
      await updateProfile(userId, data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setPasswordLoading(true);

    try {
      await apiChangePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      fontFamily: '"DM Sans", sans-serif',
      borderRadius: '12px',
      backgroundColor: theme.colors.slate50,
      "& fieldset": { borderColor: "#E2E8F0" },
      "&:hover fieldset": { borderColor: theme.colors.blue500 },
      "&.Mui-focused fieldset": { borderColor: theme.colors.blue500 },
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#94A3B8",
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: theme.colors.slate50 }}><CircularProgress /></Box>;

  return (
    <SideBar pageTitle="Settings">
      <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: theme.colors.slate50, minHeight: "calc(100vh - 72px)" }}>

        {/* Header Block */}
        <Box sx={{ mb: 4, animation: 'fadeUp 0.5s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontFamily: 'Libre Baskerville', fontSize: { xs: 24, md: 32 }, fontWeight: 700, color: theme.colors.navy900, lineHeight: 1.2 }}>
              Account Settings
            </Typography>
            <Typography sx={{ fontFamily: 'DM Sans', fontSize: 14, color: theme.colors.slate500, mt: 0.5 }}>
              Update your personal details and security preferences
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }} sx={{ animation: 'fadeUp 0.5s ease 0.1s backwards' }}>
            {/* Left Side: Avatar & Summary Card */}
            <Card sx={{ borderRadius: theme.radius.xl, boxShadow: '0 4px 20px rgba(15,32,68,0.06)', p: 3, textAlign: 'center', border: '1px solid #F1F5F9', mb: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 3, mt: 2 }}>
                <Box sx={{
                  p: 0.5,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.colors.blue500}, ${theme.colors.navy900})`,
                  display: 'inline-flex'
                }}>
                  <Avatar
                    src={preview}
                    sx={{ width: 140, height: 140, border: `4px solid white` }}
                  />
                </Box>
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute', bottom: 5, right: 5,
                    bgcolor: theme.colors.navy900, color: 'white',
                    boxShadow: '0 4px 12px rgba(15,32,68,0.3)',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: theme.colors.blue500, transform: 'scale(1.05)' }
                  }}
                >
                  <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </Box>

              <Typography sx={{ fontFamily: 'Libre Baskerville', fontSize: 22, fontWeight: 700, color: theme.colors.navy900 }}>
                {formData.username || "User"}
              </Typography>

              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 1, px: 2, py: 0.5, bgcolor: theme.colors.blue50, color: theme.colors.blue500, borderRadius: theme.radius.full }}>
                <VerifiedIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
                  {role} Account
                </Typography>
              </Box>
            </Card>

            {/* Side Info: Security Tips */}
            <Card sx={{ borderRadius: theme.radius.xl, bgcolor: theme.colors.navy900, color: 'white', p: 3, border: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <SecurityIcon sx={{ color: theme.colors.blue500 }} />
                <Typography sx={{ fontFamily: 'Libre Baskerville', fontWeight: 600, fontSize: 16 }}>Security Tips</Typography>
              </Box>
              <Typography sx={{ fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Keep your password unique and change it periodically to maintain high account security. Avoid using simple or common words.
              </Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            {/* Personal Information Form */}
            <Card sx={{ borderRadius: theme.radius.xl, boxShadow: '0 4px 20px rgba(15,32,68,0.06)', border: '1px solid #F1F5F9', mb: 4, animation: 'fadeUp 0.5s ease 0.2s backwards' }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Typography sx={{ fontFamily: 'Libre Baskerville', fontSize: 18, fontWeight: 700, color: theme.colors.navy900, mb: 3 }}>
                  Personal Information
                </Typography>



                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography sx={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: theme.colors.navy900, mb: 1 }}>Full Name</Typography>
                      <TextField fullWidth name="username" value={formData.username} onChange={handleChange} variant="outlined" sx={textFieldStyles} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography sx={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: theme.colors.navy900, mb: 1 }}>Email Address</Typography>
                      <TextField fullWidth disabled value={formData.email} sx={textFieldStyles} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography sx={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: theme.colors.navy900, mb: 1 }}>Phone Number</Typography>
                      <TextField fullWidth name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (234) 567-8900" sx={textFieldStyles} />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                      type="submit" variant="contained" disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      sx={{
                        bgcolor: theme.colors.blue500, borderRadius: theme.radius.full, px: 4, py: 1.2,
                        textTransform: 'none', fontFamily: "DM Sans", fontWeight: 600,
                        boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                        '&:hover': { bgcolor: '#2563EB' }
                      }}
                    >
                      {saving ? "Saving..." : "Update Profile"}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>

            {/* Change Password Form */}
            <Card sx={{ borderRadius: theme.radius.xl, boxShadow: '0 4px 20px rgba(15,32,68,0.06)', border: '1px solid #F1F5F9', animation: 'fadeUp 0.5s ease 0.3s backwards' }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <KeyIcon sx={{ color: theme.colors.blue500 }} />
                  <Typography sx={{ fontFamily: 'Libre Baskerville', fontSize: 18, fontWeight: 700, color: theme.colors.navy900 }}>
                    Security & Password
                  </Typography>
                </Box>



                <form onSubmit={handlePasswordSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Typography sx={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: theme.colors.navy900, mb: 1 }}>Current Password</Typography>
                      <TextField fullWidth type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" sx={textFieldStyles} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography sx={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: theme.colors.navy900, mb: 1 }}>New Password</Typography>
                      <TextField fullWidth type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="••••••••" sx={textFieldStyles} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography sx={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: theme.colors.navy900, mb: 1 }}>Confirm New Password</Typography>
                      <TextField fullWidth type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" sx={textFieldStyles} />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                      type="submit" variant="contained" disabled={passwordLoading}
                      startIcon={passwordLoading ? <CircularProgress size={20} color="inherit" /> : <SecurityIcon />}
                      sx={{
                        bgcolor: theme.colors.navy900, borderRadius: theme.radius.full, px: 4, py: 1.2,
                        textTransform: 'none', fontFamily: "DM Sans", fontWeight: 600,
                        boxShadow: '0 4px 14px rgba(15,32,68,0.3)',
                        '&:hover': { bgcolor: theme.colors.navy800 }
                      }}
                    >
                      {passwordLoading ? "Updating..." : "Change Password"}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Global Animation Styles */}
        <style>
          {`
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
      </Box>
    </SideBar>
  );
};

export default ProfileEdit;