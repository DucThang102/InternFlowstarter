import { createTheme } from "@mui/material";

export default createTheme({
  palette: {
    primary: { main: "#009688" },
  },
  typography: {
    fontFamily: "Tomorrow, Arial",
  },
  components: {
    MuiCardMedia: {
      styleOverrides: {
        root: {
          width: "auto",
        },
      },
    },
  },
});
