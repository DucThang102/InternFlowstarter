import MenuIcon from "@mui/icons-material/Menu";
import { Button, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";
import Menu from "../Menu/Menu";

function Header({
  onConnect,
  currentAcc,
  signer,
  getHeroOfAccount,
  windowWidth,
}) {
  const [isShow, setIsShow] = useState(false);

  const toggleDrawer = (open) => {
    setIsShow(open);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        py={{ xxs: 2, sm: 4 }}
      >
        <Button
          onClick={() => onConnect()}
          sx={{
            display: { xxs: "block", xs: "inline-flex" },
            textTransform: "none",
            overflow: { xxs: "hidden", xs: "unset" },
            width: { xxs: "70%", xs: "auto" },
            textOverflow: { xxs: "ellipsis", xs: "unset" },
          }}
          size="small"
          variant="outlined"
        >
          {currentAcc || "Connect Metamask"}
        </Button>
        <IconButton
          sx={{ display: { xs: "block", sm: "none" } }}
          color="primary"
          onClick={() => toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Stack>
      {windowWidth <= 600 && (
        <Menu
          signer={signer}
          getHeroOfAccount={getHeroOfAccount}
          isShow={isShow}
          onToggleMenu={toggleDrawer}
        />
      )}
    </>
  );
}

export default Header;
