import { createTheme } from "@mui/material";
import { purple } from "@mui/material/colors";

export default createTheme({
  palette: {
    primary: { main: purple[400] },
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
