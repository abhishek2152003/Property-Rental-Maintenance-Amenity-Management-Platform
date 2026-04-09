import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Button, TextField, Avatar, Card, 
  Grid, IconButton, CircularProgress, Alert 
} from "@mui/material";
import { PhotoCamera, Save, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SideBar from "../component/SideBar";
import { fetchUserProfile, updateProfile } from "../api/user";

const theme = {
  colors: {
    navy900: '#0F2044',
    navy800: '#162B5B',
    slate50: '#F8FAFC',
    slate500: '#64748B',
    blue50: '#EFF6FF',
  },
  radius: { lg: '18px', xl: '24px', full: '9999px' }
};

const ProfileEdit = () => {
  const navigate = useNavigate();
  // In a real app, get this ID from your Auth Context/JWT
  const userId = "65ead..."; 

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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchUserProfile(userId);
        setFormData({
          username: user.username,
          email: user.email,
          phone: user.phone || "",
        });
        if (user.image) setPreview(`http://localhost:7001/${user.image}`);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file)); // Show instant preview
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

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <SideBar>
      <Box sx={{ p: "24px 32px", bgcolor: theme.colors.slate50, minHeight: "100vh" }}>
        
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: theme.colors.slate500, textTransform: 'none' }}
        >
          Back to Dashboard
        </Button>

        <Typography sx={{ fontFamily: 'Libre Baskerville', fontSize: 28, fontWeight: 700, mb: 4, color: theme.colors.navy900 }}>
          Edit Profile
        </Typography>

        <Card sx={{ borderRadius: theme.radius.xl, p: 4, maxWidth: 800, boxShadow: '0 4px 20px rgba(15,32,68,0.08)' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              
              {/* Avatar Upload Section */}
              <Grid item xs={12} display="flex" flexDirection="column" alignItems="center">
                <Box sx={{ position: 'relative' }}>
                  <Avatar 
                    src={preview} 
                    sx={{ width: 120, height: 120, mb: 2, border: `4px solid white`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                  />
                  <IconButton 
                    component="label" 
                    sx={{ 
                      position: 'absolute', bottom: 15, right: 0, 
                      bgcolor: theme.colors.navy800, color: 'white',
                      '&:hover': { bgcolor: theme.colors.navy900 }
                    }}
                  >
                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                </Box>
                <Typography sx={{ fontSize: 12, color: theme.colors.slate500 }}>
                  JPG, GIF or PNG. Max size of 2MB
                </Typography>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Username</Typography>
                <TextField 
                  fullWidth name="username" value={formData.username} 
                  onChange={handleChange} variant="outlined" size="small" 
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Email Address</Typography>
                <TextField 
                  fullWidth disabled value={formData.email} 
                  helperText="Email cannot be changed" size="small" 
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Phone Number</Typography>
                <TextField 
                  fullWidth name="phone" value={formData.phone} 
                  onChange={handleChange} placeholder="+1 234 567 890" size="small" 
                />
              </Grid>

              <Grid item xs={12}>
                {message.text && (
                  <Alert severity={message.type} sx={{ mb: 2, borderRadius: '8px' }}>
                    {message.text}
                  </Alert>
                )}
                
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button 
                    type="submit" variant="contained" disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    sx={{ bgcolor: theme.colors.navy800, borderRadius: theme.radius.full, px: 4, textTransform: 'none' }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button 
                    onClick={() => navigate(-1)}
                    sx={{ color: theme.colors.slate500, textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Box>
    </SideBar>
  );
};

export default ProfileEdit;