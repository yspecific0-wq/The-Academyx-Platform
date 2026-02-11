import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Avatar, CircularProgress, Stack, Chip } from "@mui/material";
import { School, Groups, Assignment, VerifiedUser } from "@mui/icons-material";
import api from "../api/axios";

const TeacherDashboard = () => {
  // Synchronized state with backend keys
  const [stats, setStats] = useState({ 
    assigned_classes_count: 0, 
    total_students: 0, 
    attendance_reports_today: 0,
    managed_classes: [] 
  });
  const [loading, setLoading] = useState(true);
  
  // Get username from stored user object for consistency
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || "Teacher";

  useEffect(() => {
    const fetchTeacherStats = async () => {
      try {
        // Updated to use the consistent accounts endpoint
        const res = await api.get("accounts/teacher-dashboard/"); 
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching teacher dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherStats();
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
      <CircularProgress sx={{ color: "#1A56DB" }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 0 } }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, color: "#0F172A" }}>
        Welcome, {username}
      </Typography>
      <Typography variant="body1" sx={{ color: "#64748B", mb: 4 }}>
        Teacher Overview & Class Statistics
      </Typography>
      
      {/* --- IN-CHARGE STATUS SECTION --- */}
      {stats.managed_classes && stats.managed_classes.length > 0 && (
        <Paper elevation={0} sx={{ p: 2, mb: 4, bgcolor: "rgba(26, 86, 219, 0.05)", border: "1px solid rgba(26, 86, 219, 0.2)", borderRadius: "0px" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <VerifiedUser sx={{ color: "#1A56DB" }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0F172A", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: 1 }}>
                Class In-Charge Status
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                {stats.managed_classes.map((cls) => (
                  <Chip key={cls} label={cls} size="small" sx={{ bgcolor: "#1A56DB", color: "white", fontWeight: 700, borderRadius: "2px" }} />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* --- STATISTICS GRID --- */}
      <Grid container spacing={3}>
        {[
          { icon: <School />, value: stats.assigned_classes_count, label: "Assigned Classes", color: '#1A56DB' },
          { icon: <Groups />, value: stats.total_students, label: "Total Students", color: '#10B981' },
          { icon: <Assignment />, value: stats.attendance_reports_today, label: "Reports Today", color: '#F59E0B' }
        ].map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: "0px", 
                border: "1px solid #E2E8F0", 
                textAlign: 'center',
                transition: "0.3s",
                "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderColor: stat.color }
              }}
            >
              <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, m: '0 auto', mb: 2, borderRadius: "8px" }}>
                {stat.icon}
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#0F172A" }}>
                {stat.value}
              </Typography>
              <Typography sx={{ color: "#64748B", fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 1, mt: 1 }}>
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TeacherDashboard;