import React from "react";
import { Box, Typography, Grid, Card, CardContent, Chip, Divider } from "@mui/material";
import Layout from "../../layouts/AdminLayout";
import SchoolIcon from "@mui/icons-material/School";

const StudentClasses = () => {
  // Mock data for now - you can connect this to an API later
  const classes = [
    { id: 1, name: "Mathematics", section: "Grade 10-A", room: "Room 302" },
    { id: 2, name: "Physics", section: "Grade 10-A", room: "Lab 1" },
  ];

  return (
    
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>My Enrolled Classes</Typography>
        <Grid container spacing={3}>
          {classes.map((cls) => (
            <Grid item xs={12} md={6} key={cls.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">{cls.name}</Typography>
                    <Chip icon={<SchoolIcon />} label={cls.section} size="small" color="primary" variant="outlined" />
                  </Box>
                  <Typography color="textSecondary">Location: {cls.room}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    
  );
};

export default StudentClasses;