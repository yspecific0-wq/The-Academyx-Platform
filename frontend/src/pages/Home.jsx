import React from "react";
import { Box, Typography, Button, Container, Stack, AppBar, Toolbar, InputBase, Paper, Grid } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  // BRAND COLORS
  const royalGradient = "linear-gradient(135deg, #1A56DB 0%, #0F172A 100%)"; 
  const brandBlue = "#1A56DB";
  const darkNavy = "#0F172A";
  const offWhite = "#F8FAFC";

  return (
    <Box sx={{ bgcolor: offWhite, minHeight: "100vh" }}>
      
      {/* --- HEADER: LOGO & ROYAL GRADIENT --- */}
      <AppBar position="static" elevation={0} sx={{ background: royalGradient, py: 2.5 }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", gap: 4 }}>
            
            {/* --- LOGO EMBLEM AREA --- */}
            <Stack direction="row" alignItems="center" spacing={3}>
              <Box 
                sx={{ 
                  bgcolor: "white", 
                  height: 95, 
                  width: 95, 
                  borderRadius: "16px", 
                  display: "flex", 
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.3)", 
                  border: "1px solid rgba(255,255,255,0.4)",
                  cursor: "pointer",
                  overflow: "hidden", 
                  p: 1.5 
                }}
                onClick={() => navigate("/")}
              >
                <Box 
                  component="img" 
                  src="/logo2.jpeg" // Clean path to public/logo2.jpeg
                  alt="The Academyx"
                  sx={{ 
                    height: "100%", 
                    width: "100%", 
                    objectFit: "contain",
                  }} 
                  // Fallback to JPEG if PNG is missing
                  onError={(e) => { e.target.src = "/logo2.jpeg"; }}
                />
              </Box>
              
              <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, color: "white", letterSpacing: "3px", lineHeight: 1, fontSize: "2.1rem" }}>
                  THE <span style={{ fontWeight: 800 }}>ACADEMYX</span>
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "8px", fontSize: "0.75rem", textTransform: "uppercase", mt: 1, display: "block" }}>
                  Global Excellence
                </Typography>
              </Box>
            </Stack>

            {/* SEARCH BAR */}
            <Paper elevation={0} sx={{ p: "10px 25px", display: "flex", alignItems: "center", flex: 1, maxWidth: "480px", borderRadius: "40px", bgcolor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}>
              <InputBase sx={{ ml: 1, flex: 1, fontSize: "1rem", color: "white" }} placeholder="Search resources..." />
              <SearchIcon sx={{ color: "white", opacity: 0.9 }} />
            </Paper>

            <Stack direction="row" spacing={4} alignItems="center">
              <Button 
                variant="outlined" 
                onClick={() => navigate("/login")}
                sx={{ 
                  color: "white", borderColor: "white", px: 5, py: 1.2, 
                  borderRadius: "0px", fontWeight: 800, borderWidth: '2px',
                  "&:hover": { borderWidth: '2px', bgcolor: "white", color: brandBlue } 
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* --- CINEMATIC HERO SECTION --- */}
      <Container maxWidth="xl" sx={{ pt: 12, pb: 10 }}>
        <Stack spacing={8} alignItems="center">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h1" sx={{ fontSize: { xs: "3.5rem", md: "6rem" }, fontFamily: "'Playfair Display', serif", fontWeight: 900, lineHeight: 1.1, color: darkNavy }}>
              Empowering Minds, <br/> Fueling <span style={{ color: brandBlue, fontStyle: 'italic', fontWeight: 400 }}>Futures.</span>
            </Typography>
            <Typography variant="body1" sx={{ color: "#475569", fontSize: "1.3rem", maxWidth: "800px" }}>
              The definitive ecosystem built for the next generation of academic excellence.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Button 
                variant="contained" 
                onClick={() => navigate("/login")}
                sx={{ bgcolor: brandBlue, px: 6, py: 2.5, borderRadius: "0px", fontWeight: 800 }}
              >
                LAUNCH PORTAL
              </Button>
              <Button variant="text" sx={{ color: darkNavy, px: 4, fontWeight: 800, letterSpacing: 2 }}>VIEW DEMO —</Button>
            </Stack>
          </Stack>

          <Box sx={{ width: "100%", maxWidth: "1200px", borderRadius: "0px", overflow: "hidden", boxShadow: "0 80px 150px -30px rgba(0,0,0,0.3)", border: "15px solid white" }}>
            <Box 
              component="img" 
              src="/hero-bg.png" // Pointing to public/hero-bg.png
              sx={{ width: "100%", height: "auto", display: "block" }} 
            />
          </Box>
        </Stack>
      </Container>

      {/* --- STATISTICS GRID & OTHER SECTIONS REMAIN SAME --- */}
      {/* ... (rest of your existing sections) ... */}

    </Box>
  );
};

export default Home;