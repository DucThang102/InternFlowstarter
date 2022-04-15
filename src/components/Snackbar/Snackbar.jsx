import { Alert, Snackbar } from "@mui/material";
import React from "react";

function SnackbarCustom({ open, type, onClose, msg }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {msg}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarCustom;
