import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import api from "../api/axios";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      border: "1px solid #e2e8f0",
      transition: "transform 0.2s",
      "&:hover": { transform: "translateY(-5px)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }
    }}
  >
    <Box sx={{ bgcolor: `${color}15`, p: 2, borderRadius: 3, mr: 2 }}>
      {React.cloneElement(icon, { sx: { color: color, fontSize: 32 } })}
    </Box>
    <Box>
      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>{title}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>{value}</Typography>
    </Box>
  </Paper>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_teachers: 0,
    total_students: 0,
    total_parents: 0,
    total_users: 0
  });

  useEffect(() => {
    api.get("/admin-dashboard/")
      .then(res => setStats(res.data))
      .catch(err => console.error("Dashboard Load Error:", err));
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>School Admin</Typography>
      <Typography sx={{ color: "#64748b", mb: 4 }}>Welcome back, overview of system activity.</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Teachers" value={stats.total_teachers} color="#3b82f6" icon={<PeopleAltIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Students" value={stats.total_students} color="#10b981" icon={<PeopleAltIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Parents" value={stats.total_parents} color="#f59e0b" icon={<PeopleAltIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="System Users" value={stats.total_users} color="#6366f1" icon={<PeopleAltIcon />} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;