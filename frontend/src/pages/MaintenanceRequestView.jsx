import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  InputBase,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Search,
  Add,
  MoreVert,
  AccessTime,
  Engineering,
  CheckCircle,
  Build,
  Edit
} from "@mui/icons-material";
import SideBar from "../component/SideBar";
import { 
  deleteMaintenanceRequest, 
  getAllRequests, 
  fetchUserRequests, 
  updateMaintenanceStatus 
} from "../api/maintenanceRequest";
import { jwtDecode } from "jwt-decode";

// PropFlow Design System Tokens
const theme = {
  colors: {
    navy900: "#0F2044",
    navy800: "#162B5B",
    slate50: "#F8FAFC",
    slate300: "#CBD5E1",
    slate500: "#64748B",
    slate700: "#334155",
    blue50: "#EFF6FF",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
    error: "#EF4444",
  },
  radius: { lg: "18px", xl: "24px", full: "9999px" },
};

const MaintenancePage = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getMaintenanceData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      let decoded;
      try {
        decoded = jwtDecode(token);
        setUser(decoded);
        setIsOwner(decoded.role.toLowerCase() === "owner");
      } catch (err) {
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const isUserOwner = decoded.role.toLowerCase() === "owner";
        const resData = isUserOwner 
          ? await getAllRequests() 
          : await fetchUserRequests(decoded.id);

        setRequests(resData);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    getMaintenanceData();
  }, [navigate]);

  const getStatusChip = (status) => {
    const config = {
      Pending: { bg: "#FEF3C7", text: "#92400E", dot: theme.colors.warning },
      "In Progress": { bg: "#DBEAFE", text: "#1E40AF", dot: theme.colors.info },
      Completed: { bg: "#D1FAE5", text: "#065F46", dot: theme.colors.success },
    };
    const style = config[status] || config["Pending"];

    return (
      <Chip
        label={status}
        sx={{
          bgcolor: style.bg,
          color: style.text,
          fontWeight: 600,
          fontSize: "12px",
          borderRadius: theme.radius.full,
          height: "24px",
          "&::before": {
            content: '""',
            width: 6,
            height: 6,
            borderRadius: "50%",
            mr: 1,
            bgcolor: style.dot,
          },
        }}
      />
    );
  };

  const handleActionOpen = (event, ticket) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicket(ticket);
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedTicket || !selectedTicket._id) return;
    try {
      await updateMaintenanceStatus(selectedTicket._id, status);
      
      // Update local state without fetching again
      setRequests((prev) =>
        prev.map((req) =>
          req._id === selectedTicket._id ? { ...req, status } : req
        )
      );
      setAnchorEl(null);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!selectedTicket || !selectedTicket._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?",
    );
    if (!confirmDelete) return;

    try {
      await deleteMaintenanceRequest(selectedTicket._id);
      setRequests((prev) =>
        prev.filter((req) => req._id !== selectedTicket._id),
      );
      setAnchorEl(null);
      alert("Ticket Deleted");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete: " + (err.error || "Server Error"));
    }
  };

  return (
    <SideBar>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: theme.colors.slate50,
          minHeight: "100vh",
          p: "24px 32px",
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
              {isOwner ? "Maintenance Management" : "My Support Tickets"}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: theme.colors.slate500,
                letterSpacing: "0.08em",
                mt: 0.5,
              }}
            >
              STATUS: {isOwner ? "OWNER" : "TENANT"}
            </Typography>
          </Box>

          {!isOwner && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/tenant/maintenance/add")}
              sx={{
                bgcolor: theme.colors.navy800,
                borderRadius: theme.radius.full,
                px: 3,
                textTransform: "none",
                fontFamily: "DM Sans",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(22,43,91,0.35)",
                "&:hover": { bgcolor: "#1E3A72" },
              }}
            >
              Request Repair
            </Button>
          )}
        </Box>

        {/* Stats Section (Calculated from Data) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
            mb: 4,
          }}
        >
          {[
            {
              label: "Open",
              count: requests.filter((r) => r.status === "Pending").length,
              icon: <AccessTime />,
              color: theme.colors.warning,
            },
            {
              label: "Active",
              count: requests.filter((r) => r.status === "In Progress").length,
              icon: <Engineering />,
              color: theme.colors.info,
            },
            {
              label: "Resolved",
              count: requests.filter((r) => r.status === "Completed").length,
              icon: <CheckCircle />,
              color: theme.colors.success,
            },
          ].map((stat, idx) => (
            <Card
              key={idx}
              sx={{
                p: 3,
                borderRadius: theme.radius.lg,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 12px rgba(15,32,68,0.08)",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: theme.colors.slate500,
                  }}
                >
                  {stat.label.toUpperCase()}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: theme.colors.navy900,
                    fontFamily: "Libre Baskerville",
                  }}
                >
                  {stat.count}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </Avatar>
            </Card>
          ))}
        </Box>

        {/* Maintenance Table */}
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
                    CATEGORY
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
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: theme.colors.slate500,
                    }}
                  >
                    PRIORITY
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: theme.colors.slate500,
                    }}
                  >
                    STATUS
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 4, color: theme.colors.slate500 }}
                    >
                      No requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((req) => (
                    <TableRow
                      key={req._id}
                      sx={{ "&:hover": { bgcolor: theme.colors.blue50 } }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: theme.colors.blue50,
                              color: theme.colors.navy800,
                            }}
                          >
                            <Build sx={{ fontSize: 16 }} />
                          </Avatar>
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: theme.colors.navy900,
                            }}
                          >
                            {req.category}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: theme.colors.slate700,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {req.issueDescription}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color:
                              req.priority === "High"
                                ? theme.colors.error
                                : req.priority === "Medium"
                                  ? theme.colors.warning
                                  : theme.colors.success,
                          }}
                        >
                          {req.priority.toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(req.status)}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleActionOpen(e, req)}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Action Menu (Update Status) */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {!isOwner && (
            <MenuItem 
              onClick={() => {
              navigate(`/tenant/maintenance/edit/${selectedTicket._id}`);
              }}
              sx={{ fontSize: 14, fontFamily: "DM Sans", gap: 1 }}
            >
              <Edit sx={{ fontSize: 18, color: theme.colors.slate500 }} /> Edit Ticket
            </MenuItem>
          )}

          {isOwner && (
            <MenuItem
              onClick={() => handleUpdateStatus("In Progress")}
              sx={{
                fontSize: 14,
                fontFamily: "DM Sans",
                color: theme.colors.info,
              }}
            >
              Mark In Progress
            </MenuItem>
          )}

          {isOwner && (
            <MenuItem
              onClick={() => handleUpdateStatus("Completed")}
              sx={{
                fontSize: 14,
                fontFamily: "DM Sans",
                color: theme.colors.success,
              }}
            >
              Mark Completed
            </MenuItem>
          )}

          {!isOwner && (
            <MenuItem
              onClick={handleDelete}
              sx={{
                fontSize: 14,
                fontFamily: "DM Sans",
                color: theme.colors.error,
              }}
            >
              Delete Ticket
            </MenuItem>
          )}
        </Menu>
      </Box>
    </SideBar>
  );
};

export default MaintenancePage;
