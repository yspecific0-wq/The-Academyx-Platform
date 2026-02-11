import { useState } from "react";
import api from "../api/axios";
import branding from "../config/branding";

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Grid,
} from "@mui/material";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("password-reset/", { email });
      setMessage(
        "If an account exists with this email, a reset link has been sent."
      );
    } catch {
      setError("Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container minHeight="100vh">
      {/* LEFT BRAND PANEL (DESKTOP ONLY) */}
      <Grid
        item
        md={6}
        sx={{
          display: { xs: "none", md: "flex" },
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "white",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 6,
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {branding.appName}
          </Typography>

          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {branding.tagline}
          </Typography>

          <Typography sx={{ mt: 3, opacity: 0.85 }}>
            Reset your password securely and get back to learning.
          </Typography>
        </Box>
      </Grid>

      {/* RIGHT FORM PANEL */}
      <Grid
        item
        xs={12}
        md={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Card
          sx={{
            width: 380,
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              align="center"
              gutterBottom
            >
              Forgot Password
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              mb={3}
            >
              Enter your registered email to receive a reset link
            </Typography>

            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Email address"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 3,
                  py: 1.2,
                  borderRadius: 2,
                }}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </Box>

            {/* BACK TO LOGIN */}
            <Typography
              variant="body2"
              align="center"
              sx={{
                mt: 3,
                cursor: "pointer",
                color: "primary.main",
                textDecoration: "underline",
              }}
              onClick={() => window.location.href = "/"}
            >
              Back to login
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ForgotPassword;
