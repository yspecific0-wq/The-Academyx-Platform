import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
// Safely import branding or use defaults to prevent crash
import branding from "../config/branding";

import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Stack,
  Paper,
  Container
} from "@mui/material";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // BRAND COLORS
  const royalGradient = "linear-gradient(135deg, #1A56DB 0%, #0F172A 100%)";
  const brandBlue = "#1A56DB";
  const darkNavy = "#0F172A";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("token/", { username, password });
      const { access, refresh, role } = response.data;

      if (!access || !role) {
        throw new Error("Invalid security token or user role returned.");
      }

      localStorage.clear();
      localStorage.setItem("ACCESS_TOKEN", access);
      localStorage.setItem("REFRESH_TOKEN", refresh);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      const userRole = role.toUpperCase().trim();
      let targetPath = "";

      if (userRole === "SCHOOL_ADMIN" || userRole === "ADMIN") targetPath = "/admin";
      else if (userRole === "TEACHER") targetPath = "/teacher";
      else if (userRole === "STUDENT") targetPath = "/student";
      else if (userRole === "PARENT") targetPath = "/parent";

      if (targetPath) {
        window.location.href = targetPath;
      } else {
        setError(`Role "${userRole}" recognized but no dashboard route is defined.`);
      }
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Invalid username or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container minHeight="100vh">
      {/* --- LEFT SIDE: BRANDING --- */}
      <Grid 
        item md={6} 
        sx={{ 
          display: { xs: "none", md: "flex" }, 
          background: royalGradient, 
          color: "white", 
          alignItems: "center", 
          justifyContent: "center", 
          px: 8 
        }}
      >
        <Box maxWidth={450}>
          <Box 
            sx={{ 
              bgcolor: "white", height: 100, width: 100, borderRadius: "16px", 
              display: "flex", alignItems: "center", justifyContent: "center",
              mb: 4, boxShadow: "0 20px 40px rgba(0,0,0,0.3)", overflow: "hidden"
            }}
          >
            <Box 
              component="img" 
              src="/Gemini_Generated_Image_24xxzm24xxzm24xx (1).jpg" 
              sx={{ height: "100%", width: "100%", objectFit: "contain", transform: "scale(2.2)" }}
              onError={(e) => { e.target.style.display = 'none'; }} // Prevent crash if image missing
            />
          </Box>
          
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, mb: 1 }}>
            THE <br/> ACADEMYX
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, mb: 3 }}>
            Global Excellence
          </Typography>
          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)", width: "60px", borderWidth: 2 }} />
          <Typography variant="body1" sx={{ opacity: 0.7, fontSize: "1.1rem", lineHeight: 1.8 }}>
            {branding?.tagline || "Secure portal for school administration and academic management."}
          </Typography>
        </Box>
      </Grid>

      {/* --- RIGHT SIDE: FORM --- */}
      <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: "#F8FAFC" }}>
        <Container maxWidth="xs">
          <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, bgcolor: "transparent" }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: darkNavy, mb: 1 }}>
              Portal Access
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 4 }}>
              Enter your credentials below.
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "0px" }}>{error}</Alert>}

            <form onSubmit={handleLogin}>
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0px" } }}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "0px" } }}
                />
                
                <Box sx={{ textAlign: "right" }}>
                  <Typography 
                    variant="caption" 
                    onClick={() => navigate("/forgot-password")}
                    sx={{ color: brandBlue, fontWeight: 700, cursor: "pointer" }}
                  >
                    Forgot Password?
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ 
                    mt: 2, py: 1.8, bgcolor: brandBlue, borderRadius: "0px", fontWeight: 800,
                    "&:hover": { bgcolor: darkNavy } 
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "SIGN IN"}
                </Button>

                <Button 
                  fullWidth 
                  variant="text" 
                  onClick={() => navigate("/")}
                  sx={{ mt: 1, color: "#94A3B8", fontWeight: 700 }}
                >
                  ← BACK TO HOME
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
}

export default Login;