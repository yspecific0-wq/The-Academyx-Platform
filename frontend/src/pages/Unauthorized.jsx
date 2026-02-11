import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={2}>
          Access Denied
        </Typography>

        <Typography color="text.secondary" mb={3}>
          You don’t have permission to view this page.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: "#6b7280",
            "&:hover": { backgroundColor: "#4b5563" },
          }}
        >
          Go Back
        </Button>
      </Paper>
    </Box>
  );
}

export default Unauthorized;
