import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" fontWeight={700}>
        404
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Page not found
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: "#6b7280",
          "&:hover": { backgroundColor: "#4b5563" },
        }}
      >
        Go to Login
      </Button>
    </Box>
  );
}

export default NotFound;
