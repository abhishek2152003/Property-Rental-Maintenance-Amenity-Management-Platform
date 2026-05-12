import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchUserProfile } from "../api/user";
import { useEffect } from "react";

// PropFlow Design Tokens
const tokens = {
  navy950: "#0A1628",
  navy900: "#0F2044",
  navy800: "#162B5B",
  navy700: "#1E3A72",
  blue500: "#3B82F6",
  blue400: "#60A5FA",
  blue300: "#93C5FD",
  slate50: "#F8FAFC",
  slate500: "#64748B",
  white: "#FFFFFF",
};

export default function DashboardLayout({ children, pageTitle = "Dashboard" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const [role, setRole] = useState("tenant");
  const [userName, setUserName] = useState("");
  const [initials, setInitials] = useState("??");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role.toLowerCase());

        // Fetch full profile for name and image
        const getProfile = async () => {
          try {
            const profile = await fetchUserProfile(decoded.id);
            if (profile) {
              if (profile.username) {
                setUserName(profile.username);
                // Get Initials (e.g. "Alex Johnson" -> "AJ")
                const words = profile.username.split(" ");
                const first = words[0]?.charAt(0).toUpperCase() || "";
                const last = words[words.length - 1]?.charAt(0).toUpperCase() || "";
                setInitials(first + (words.length > 1 ? last : ""));
              }
              if (profile.image) {
                setProfileImage(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001'}/${profile.image}`);
              }
            }
          } catch (err) {
            console.error("Layout Profile Fetch Error:", err);
          }
        };
        getProfile();
      } catch (e) {
        console.error("Token Decode Error:", e);
      }
    }
  }, [token]);

  // Dynamic Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const menuGroups = role === "owner" ? [
    {
      label: "Owner Portal",
      items: [
        { name: "Dashboard", path: "/owner/dashboard", icon: "📊" },
        { name: "Properties", path: "/owner/properties", icon: "📋" },
        { name: "Tenants", path: "/owner/tenants", icon: "👥" },
        { name: "Amenities", path: "/owner/amenities", icon: "🏊" },
        { name: "Maintenance", path: "/owner/maintenance", icon: "🔧" },
        { name: "Amenity Booking", path: "/owner/bookings", icon: "📋" }
      ],
    },
    {
      label: "Account",
      items: [
        { name: "Profile", path: "/profile", icon: "👤" },
        { name: "Logout", path: "/logout", icon: "🚪" }
      ]
    }
  ] : [
    {
      label: "Tenant Portal",
      items: [
        { name: "Dashboard", path: "/tenant/dashboard", icon: "📊" },
        { name: "My Bookings", path: "/tenant/bookings", icon: "📅" },
        { name: "Maintenance", path: "/tenant/maintenance", icon: "🔧" },
      ],
    },
    {
      label: "Account",
      items: [
        { name: "Profile", path: "/profile", icon: "👤" },
        { name: "Logout", path: "/logout", icon: "🚪" }
      ]
    }
  ];

  const handleMenuClick = (item) => {
    if (item.name === "Logout") {
      localStorage.removeItem("token");
      navigate("/");
    } else {
      navigate(item.path);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: tokens.slate50 }}>

      {/* ============================== */}
      {/* 1. LEFT SIDEBAR                */}
      {/* ============================== */}
      <Box
        component="aside"
        sx={{
          width: "200px",
          flexShrink: 0, // Prevents sidebar from squishing
          minHeight: "100vh",
          backgroundColor: tokens.navy950,
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Libre Baskerville", serif',
            fontSize: "16px",
            fontWeight: 700,
            color: tokens.white,
            marginBottom: "28px",
            padding: "0 8px",
          }}
        >
          Prop<span style={{ color: tokens.blue400 }}>Flow</span>
        </Typography>

        {/* Menu Groups */}
        {menuGroups.map((group, groupIndex) => (
          <Box key={group.label} sx={{ mb: groupIndex === 0 ? 1 : 0 }}>
            <Typography
              sx={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                padding: "0 8px",
                marginBottom: "6px",
                marginTop: "16px",
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              {group.label}
            </Typography>

            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Box
                  key={item.name}
                  onClick={() => handleMenuClick(item)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 10px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: '"DM Sans", sans-serif',
                    color: isActive ? tokens.blue300 : "rgba(255,255,255,0.55)",
                    backgroundColor: isActive ? "rgba(59,130,246,0.18)" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    marginBottom: "2px",
                    "&:hover": {
                      backgroundColor: isActive ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.06)",
                      color: isActive ? tokens.blue300 : "rgba(255,255,255,0.85)",
                    },
                  }}
                >
                  <Box component="span" sx={{ fontSize: "15px", display: "flex" }}>
                    {item.icon}
                  </Box>
                  {item.name}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* ============================== */}
      {/* 2. RIGHT CONTENT AREA          */}
      {/* ============================== */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", width: '100%', maxWidth: '100%' }}>

        {/* TOP NAVBAR */}
        <Box
          component="header"
          sx={{
            height: "72px",
            backgroundColor: tokens.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            boxShadow: "0 1px 3px rgba(15,32,68,0.08)", // --shadow-sm
            zIndex: 10,
          }}
        >
          {/* Optional Page Title in TopBar */}
          <Typography
            sx={{
              fontFamily: '"Libre Baskerville", serif',
              fontSize: "20px",
              fontWeight: 700,
              color: tokens.navy900,
            }}
          >
            {pageTitle}
          </Typography>

          {/* Right side Profile Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: tokens.slate500, fontFamily: '"DM Sans"' }}>
              {getGreeting()}, {userName || "User"}
            </Typography>
            <Avatar
              onClick={() => navigate("/profile")}
              src={profileImage}
              sx={{
                width: 38,
                height: 38,
                background: profileImage ? 'transparent' : `linear-gradient(135deg, ${tokens.navy700}, ${tokens.blue500})`,
                color: tokens.white,
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: '"DM Sans", sans-serif',
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(59,130,246,0.25)",
                "&:hover": { transform: 'scale(1.05)' }
              }}
            >
              {!profileImage && initials}
            </Avatar>
          </Box>
        </Box>


        {/* PAGE INJECTION (Forms, Tables, etc go here) */}
        <Box component="main" sx={{ flexGrow: 1, overflowY: "auto", display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 }}>
          {children}
        </Box>

      </Box>
    </Box>
  );
}