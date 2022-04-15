import { Box, Button } from "@mui/material";
import React from "react";

function Header({ onConnect, currentAcc }) {
  return (
    <Box py={4}>
      <Button
        onClick={() => onConnect()}
        sx={{ textTransform: "none" }}
        size="small"
        variant="outlined"
      >
        {currentAcc || "Connect Metamask"}
      </Button>
    </Box>
  );
}

export default Header;
