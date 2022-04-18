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
  breakpoints: {
    keys: ["xxs", "xs", "sm", "md", "lg", "xl"],
    values: {
      xxs: 0,
      xs: 415,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
