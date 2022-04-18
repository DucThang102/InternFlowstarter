import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import * as React from "react";
import Sidebar from "../Sidebar/Sidebar";

export default function Menu({
  isShow,
  signer,
  getHeroOfAccount,
  onToggleMenu,
}) {
  return (
    <div>
      <SwipeableDrawer
        sx={{
          "& .MuiPaper-root": { width: " 100%" },
        }}
        anchor="right"
        open={isShow}
        onClose={() => onToggleMenu(false)}
        onOpen={() => onToggleMenu(true)}
      >
        <Sidebar
          signer={signer}
          onToggleMenu={onToggleMenu}
          getHeroOfAccount={getHeroOfAccount}
        />
      </SwipeableDrawer>
    </div>
  );
}
