import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/system";
import { useState } from "react";

export default function AlertDialog({ show, onClose, onSubmit }) {
  const [value, setValue] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
    onClose();
  };

  return (
    <>
      <Dialog
        open={show}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Transfer Hero</DialogTitle>
        <Box
          sx={{ width: { xs: "300px", sm: "500px" } }}
          component="form"
          onSubmit={handleSubmit}
        >
          <DialogContent>
            <TextField
              id="filled-basic"
              label="Address account"
              variant="filled"
              value={value}
              fullWidth
              inputRef={(input) => input && input.focus()}
              onChange={(e) => setValue(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Transfer
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
