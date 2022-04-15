import { Backdrop as BackdropMui } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";

export default function SimpleBackdrop({ show }) {
  // const handleClose = () => {
  //   setOpen(false);
  // };
  // const handleToggle = () => {
  //   setOpen(!open);
  // };

  return (
    <BackdropMui
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={show}
    >
      <CircularProgress color="inherit" />
    </BackdropMui>
  );
}
