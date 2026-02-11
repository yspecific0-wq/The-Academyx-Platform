import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Button, CircularProgress, Stack, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Person, School as SchoolIcon } from "@mui/icons-material";
import api from "../api/axios";

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // THEMED BRAND COLORS
  const brandBlue = "#1A56DB";
  const darkNavy = "#0F172A";
  const offWhite = "#F8FAFC";

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.get("accounts/parent-dashboard/");
        // Mapping results to match your Serializer's flat keys
        setChildren(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch error", err);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', height: '60vh', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress sx={{ color: brandBlue }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: offWhite, minHeight: "100vh" }}>
      {/* --- DASHBOARD HEADER --- */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: "'Playfair Display', serif", 
            fontWeight: 900, 
            color: darkNavy, 
            mb: 1 
          }}
        >
          Parental Overview
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500, letterSpacing: 0.5 }}>
          Linked Student Profiles & Academic Performance
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {children.length > 0 ? (
          children.map((child) => (
            <Grid item xs={12} md={6} key={child.id}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  border: "1px solid #E2E8F0", 
                  borderRadius: "0px", // Geometric Square Style
                  bgcolor: "white",
                  transition: "0.3s ease",
                  "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                      sx={{ 
                        bgcolor: "rgba(26, 86, 219, 0.1)", 
                        color: brandBlue, 
                        borderRadius: "4px", // Matching Square Theme
                        width: 50, 
                        height: 50 
                      }}
                    >
                      <Person />
                    </Avatar>
                    <Box>
                      {/* Pulls student_name from Serializer */}
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: darkNavy, lineHeight: 1.2 }}>
                        {child.student_name || "Unknown Student"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: brandBlue, fontWeight: 700, textTransform: "uppercase" }}>
                        CLASS: {child.class_display || "Not Assigned"}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* School Name Section */}
                  <Stack 
                    direction="row" 
                    spacing={1.5} 
                    alignItems="center" 
                    sx={{ bgcolor: "#F1F5F9", p: 1.5, borderLeft: `4px solid ${brandBlue}` }}
                  >
                    <SchoolIcon sx={{ fontSize: "1.2rem", color: "#64748B" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>
                      {child.school_name || "Institutional Affiliate"}
                    </Typography>
                  </Stack>

                  <Button 
                    fullWidth 
                    variant="contained" 
                    onClick={() => navigate(`/parent/reports/${child.id}`)}
                    sx={{ 
                      bgcolor: darkNavy, 
                      borderRadius: "0px", 
                      py: 1.8, 
                      fontWeight: 800, 
                      letterSpacing: 1,
                      "&:hover": { bgcolor: brandBlue } 
                    }}
                  >
                    VIEW ATTENDANCE REPORT
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))
        ) : (
          <Box sx={{ p: 6, textAlign: 'center', width: '100%', border: "2px dashed #E2E8F0" }}>
            <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 700 }}>
              No linked student profiles found. 
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Ensure the "Parent link" relationship is established in the Academyx Admin Panel.
            </Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default ParentDashboard;