import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, TextField, Avatar, Card, CardContent,
  Grid, IconButton, CircularProgress, Alert, Divider
} from "@mui/material";
import { PhotoCamera, Save, ArrowBack, VerifiedUser as VerifiedIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SideBar from "../component/SideBar";
import { fetchUserProfile, updateProfile } from "../api/user";
import { jwtDecode } from "jwt-decode";

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
  },
  radius: { lg: '18px', xl: '24px', full: '9999px' }
};

const ProfileEdit = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    image: null,
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
        if (user.image) setPreview(`http://localhost:7001/${user.image}`);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load profile." });
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
    setMessage({ type: "", text: "" });

    const data = new FormData();
    data.append("username", formData.username);
    data.append("phone", formData.phone);
    if (formData.image) data.append("image", formData.image);

    try {
      await updateProfile(userId, data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Update failed." });
    } finally {
      setSaving(false);
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
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ mb: 1, color: theme.colors.slate500, textTransform: 'none', fontFamily: "DM Sans", fontWeight: 600, '&:hover': { bgcolor: 'transparent', color: theme.colors.navy900 } }}
            >
              Back
            </Button>
            <Typography sx={{ fontFamily: 'Libre Baskerville', fontSize: { xs: 24, md: 32 }, fontWeight: 700, color: theme.colors.navy900, lineHeight: 1.2 }}>
              My Profile
            </Typography>
            <Typography sx={{ fontFamily: 'DM Sans', fontSize: 14, color: theme.colors.slate500, mt: 0.5 }}>
              Manage your personal information and account settings
            </Typography>
          </Box>
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3, borderRadius: '12px', fontFamily: "DM Sans", fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>

            {/* Left Side: Avatar & Summary Card */}
            <Grid size={{ xs: 12, md: 4 }} sx={{ animation: 'fadeUp 0.5s ease 0.1s backwards' }}>
              <Card sx={{ borderRadius: theme.radius.xl, boxShadow: '0 4px 20px rgba(15,32,68,0.06)', p: 3, textAlign: 'center', border: '1px solid #F1F5F9' }}>
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

                <Divider sx={{ my: 3, borderColor: '#F1F5F9' }} />

                <Typography sx={{ fontFamily: 'DM Sans', fontSize: 12, color: theme.colors.slate500, px: 2, lineHeight: 1.6 }}>
                  Upload a new avatar. Larger image will be resized automatically.
                  <br />Maximum upload size is <strong>2 MB</strong>.
                </Typography>
              </Card>
            </Grid>

            {/* Right Side: Form Details Card */}
            <Grid size={{ xs: 12, md: 8 }} sx={{ animation: 'fadeUp 0.5s ease 0.2s backwards' }}>
              <Card sx={{ borderRadius: theme.radius.xl, boxShadow: '0 4px 20px rgba(15,32,68,0.06)', border: '1px solid #F1F5F9' }}>
                <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                  <Typography sx={{ fontFamily: 'Libre Baskerville', fontSize: 18, fontWeight: 700, color: theme.colors.navy900, mb: 3 }}>
                    Personal Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography sx={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: theme.colors.navy900, mb: 1 }}>
                        Full Name
                      </Typography>
                      <TextField
                        fullWidth name="username" value={formData.username}
                        onChange={handleChange} variant="outlined" size="medium" placeholder="e.g. John Doe"
                        sx={textFieldStyles}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography sx={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: theme.colors.navy900, mb: 1 }}>
                        Email Address
                      </Typography>
                      <TextField
                        fullWidth disabled value={formData.email}
                        size="medium" sx={textFieldStyles}
                      />
                      <Typography sx={{ fontSize: 11, fontFamily: 'DM Sans', mt: 0.5, color: '#94A3B8' }}>
                        Email linked to your account cannot be changed.
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography sx={{ fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, color: theme.colors.navy900, mb: 1 }}>
                        Phone Number
                      </Typography>
                      <TextField
                        fullWidth name="phone" value={formData.phone}
                        onChange={handleChange} placeholder="+1 (234) 567-8900" size="medium"
                        sx={textFieldStyles}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4, borderColor: '#F1F5F9' }} />

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button
                      onClick={() => navigate(-1)}
                      sx={{ color: theme.colors.slate500, textTransform: 'none', fontFamily: "DM Sans", fontWeight: 600, px: 3, borderRadius: theme.radius.full }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit" variant="contained" disabled={saving}
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      sx={{
                        bgcolor: theme.colors.blue500, color: 'white',
                        borderRadius: theme.radius.full, px: 4, py: 1.2,
                        textTransform: 'none', fontFamily: "DM Sans", fontWeight: 600,
                        boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: '#2563EB', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(59,130,246,0.4)' }
                      }}
                    >
                      {saving ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </form>
      </Box>
    </SideBar>
  );
};

export default ProfileEdit;