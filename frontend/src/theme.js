import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f3f4f6",
    },
    primary: {
      main: "#6b7280",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1f2933",
      paper: "#2f3e46",
    },
    primary: {
      main: "#9ca3af",
    },
  },
});
