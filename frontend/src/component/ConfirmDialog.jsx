import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { ReportProblem as WarningIcon } from "@mui/icons-material";

const tokens = {
  navy900: "#0F2044",
  navy800: "#162B5B",
  slate700: "#334155",
  slate500: "#64748B",
  blue500: "#3B82F6",
  error: "#EF4444",
  white: "#FFFFFF",
};

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          padding: "8px",
          maxWidth: "400px",
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {isDanger && <WarningIcon sx={{ color: tokens.error }} />}
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontFamily: "Libre Baskerville",
            fontWeight: 700,
            color: tokens.navy900,
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            fontFamily: "DM Sans",
            color: tokens.slate500,
            fontSize: "14px",
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            color: tokens.slate700,
            fontWeight: 600,
            fontFamily: "DM Sans",
            "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: isDanger ? tokens.error : tokens.blue500,
            color: tokens.white,
            borderRadius: "12px",
            padding: "8px 24px",
            fontWeight: 600,
            fontFamily: "DM Sans",
            boxShadow: isDanger
              ? "0 4px 12px rgba(239, 68, 68, 0.2)"
              : "0 4px 12px rgba(59, 130, 246, 0.2)",
            "&:hover": {
              backgroundColor: isDanger ? "#DC2626" : "#2563EB",
            },
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
