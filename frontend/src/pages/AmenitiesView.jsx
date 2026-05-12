import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Avatar,
  Button,
  IconButton,
  Card,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  Menu,
} from "@mui/material";
import { Add, MoreVert, Edit, Delete } from "@mui/icons-material";
import SideBar from "../component/SideBar";
import { getPropertyAmenities, deleteAmenity } from "../api/amenity";
import { fetchOwnerProperties } from "../api/property";
import { jwtDecode } from "jwt-decode";
import { fetchUserProfile } from "../api/user";
import { toast } from "react-toastify";
import { useConfirm } from "../context/ConfirmContext";

const theme = {
  colors: {
    navy900: "#0F2044",
    navy800: "#162B5B",
    slate50: "#F8FAFC",
    slate300: "#CBD5E1",
    slate500: "#64748B",
    slate700: "#334155",
    blue50: "#EFF6FF",
    error: "#EF4444",
    tenantBadge: "#EFF6FF",
    ownerBadge: "#F0FDF4",
  },
  radius: { lg: "18px", xl: "24px", full: "9999px" },
};

const AmenitiesPage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [amenities, setAmenities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAmenityId, setSelectedAmenityId] = useState(null);

  // 1. Initial Load: Auth check and property fetch
  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      let decoded;
      try {
        decoded = jwtDecode(token);
        setUser(decoded);
        const userIsOwner = decoded.role?.toLowerCase() === "owner";
        setIsOwner(userIsOwner);

        setLoading(true);
        if (userIsOwner) {
          const res = await fetchOwnerProperties(decoded.id);
          const props = res.data || [];
          setProperties(props);
          if (props && props.length > 0) {
            setSelectedProperty(props[0]._id);
            const data = await getPropertyAmenities(props[0]._id);
            setAmenities(data);
          }
        } else {
          // Tenant logic: Fetch profile to get current propertyId
          const profile = await fetchUserProfile(decoded.id);
          if (profile && profile.propertyId) {
            const data = await getPropertyAmenities(profile.propertyId);
            setAmenities(data);
          }
        }
      } catch (err) {
        console.error("Initialization/Fetch Error:", err);
        toast.error("Failed to initialize amenities view");
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [navigate]);

  // 2. Handle Dropdown Change for Owners
  const handlePropertyChange = async (event) => {
    const propId = event.target.value;
    setSelectedProperty(propId);
    setLoading(true);
    try {
      const data = await getPropertyAmenities(propId);
      setAmenities(data);
    } catch (err) {
      console.error("Error updating amenities:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAmenityId) return;

    const confirmed = await confirm({
      title: "Delete Amenity",
      message: "Are you sure you want to permanently delete this amenity? This action cannot be undone.",
      confirmLabel: "Delete",
      isDanger: true
    });

    if (!confirmed) {
      handleMenuClose();
      return;
    }

    try {
      await deleteAmenity(selectedAmenityId);

      // Update local state to remove the deleted item without a full page reload
      setAmenities((prev) =>
        prev.filter((item) => item._id !== selectedAmenityId),
      );

      toast.success("Amenity deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(
        "Delete failed: " + (err.response?.data?.message || "Server error"),
      );
    } finally {
      handleMenuClose();
    }
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedAmenityId(id); // Capture the ID here
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAmenityId(null);
  };

  return (
    <SideBar>
      <Box
        sx={{
          flexGrow: 1,
          p: "24px 32px",
          bgcolor: theme.colors.slate50,
          minHeight: "100vh",
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "white",
            p: "16px 24px",
            borderRadius: theme.radius.lg,
            mb: 4,
            boxShadow: "0 1px 3px rgba(15,32,68,0.08)",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "Libre Baskerville",
                fontSize: 24,
                fontWeight: 700,
                color: theme.colors.navy900,
              }}
            >
              Property Amenities
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: theme.colors.slate500,
                mt: 0.5,
              }}
            >
              VIEWING AS:
              <Box
                component="span"
                sx={{
                  ml: 1,
                  px: 1.5,
                  py: 0.3,
                  borderRadius: theme.radius.full,
                  bgcolor: isOwner
                    ? theme.colors.ownerBadge
                    : theme.colors.tenantBadge,
                  color: isOwner ? "#14532D" : "#162B5B",
                  border: `1px solid ${isOwner ? "#BBF7D0" : "#BFDBFE"}`,
                }}
              >
                {user?.role?.toUpperCase() || "USER"}
              </Box>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {isOwner && properties.length > 0 && (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={selectedProperty}
                  onChange={handlePropertyChange}
                  sx={{
                    borderRadius: "6px",
                    fontFamily: "DM Sans",
                    fontSize: 14,
                  }}
                >
                  {properties.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {isOwner && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/owner/amenities/add")}
                sx={{
                  bgcolor: theme.colors.navy800,
                  borderRadius: theme.radius.full,
                  px: 3,
                  textTransform: "none",
                }}
              >
                Add Amenity
              </Button>
            )}
          </Box>
        </Box>

        {/* Content Table */}
        <Card
          sx={{
            borderRadius: theme.radius.xl,
            boxShadow: "0 2px 12px rgba(15,32,68,0.08)",
            overflow: "hidden",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: theme.colors.slate50 }}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: theme.colors.slate500,
                    }}
                  >
                    IMAGE
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: theme.colors.slate500,
                    }}
                  >
                    NAME
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: theme.colors.slate500,
                    }}
                  >
                    DESCRIPTION
                  </TableCell>
                  {isOwner && (
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: theme.colors.slate500,
                      }}
                    >
                      ACTIONS
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={isOwner ? 4 : 3}
                      align="center"
                      sx={{ py: 5 }}
                    >
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : amenities.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isOwner ? 4 : 3}
                      align="center"
                      sx={{ py: 5, color: theme.colors.slate500 }}
                    >
                      No amenities found for this property.
                    </TableCell>
                  </TableRow>
                ) : (
                  amenities.map((item) => (
                    <TableRow
                      key={item._id}
                      sx={{ "&:hover": { bgcolor: theme.colors.blue50 } }}
                    >
                      <TableCell>
                        <Avatar
                          variant="rounded"
                          src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001'}/${item.image?.replace(/\\/g, "/")}`}
                          sx={{ width: 48, height: 48, borderRadius: "12px" }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: theme.colors.navy900 }}
                      >
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.slate700 }}>
                        {item.description || "—"}
                      </TableCell>
                      {isOwner && (
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, item._id)}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              navigate(`/owner/amenities/edit/${selectedAmenityId}`);
              handleMenuClose();
            }}
          >
            <Edit sx={{ mr: 1, fontSize: 18 }} /> Edit
          </MenuItem>

          <MenuItem
            onClick={handleDelete} // Linked to our new function
            sx={{ color: theme.colors.error }}
          >
            <Delete sx={{ mr: 1, fontSize: 18 }} /> Delete
          </MenuItem>
        </Menu>
      </Box>
    </SideBar>
  );
};

export default AmenitiesPage;
