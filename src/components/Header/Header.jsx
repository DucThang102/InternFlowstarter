import { Box, Button } from "@mui/material";
import React from "react";

function Header({ onConnect, account }) {
  return (
    <Box py={4}>
      <Button
        onClick={() => onConnect()}
        sx={{ textTransform: "none" }}
        size="small"
        variant="outlined"
      >
        {account || "Connect Metamask"}
      </Button>
    </Box>
  );
}

export default Header;
