import { Box, CircularProgress } from "@mui/material";

function Loader() {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress sx={{ color: "#6b7280" }} />
    </Box>
  );
}

export default Loader;
