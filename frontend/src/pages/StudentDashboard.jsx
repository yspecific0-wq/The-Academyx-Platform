import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Avatar, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SchoolIcon from "@mui/icons-material/School";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Student";

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.dark' }}>
          {username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Welcome Back, {username}!</Typography>
          <Typography variant="body1" color="textSecondary">Your academic summary for this semester.</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <EventAvailableIcon sx={{ color: '#2e7d32', fontSize: 32 }} />
                <Typography variant="h6" fontWeight="bold">Attendance Status</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" mb={3}>Current requirement is 75% for exam eligibility.</Typography>
              <Button variant="contained" onClick={() => navigate("/student/attendance")}>Check My Attendance</Button>
            </CardContent>
          </Card>
        </Grid>
        {/* Classes Card and Activity Section follow similar pattern... */}
      </Grid>
    </Box>
  );
};

export default StudentDashboard;