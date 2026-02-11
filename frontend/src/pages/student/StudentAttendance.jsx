import React, { useState, useEffect, useMemo } from "react";
import { 
  Box, Typography, Grid, Card, CircularProgress, 
  Alert, Paper, Table, TableBody, TableCell, 
  TableContainer, TableRow, Chip, Divider 
} from "@mui/material";
import axios from "axios";
import Layout from "../../layouts/AdminLayout"; 

const StudentAttendance = () => {
  // Initialize state with the exact structure the UI expects
  const [data, setData] = useState({ 
    summary: { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 }, 
    recent: [], 
    total_days: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // src/pages/student/StudentAttendance.jsx

    const fetchData = async () => {
    try {
        const token = localStorage.getItem("access"); // Get token from storage

        if (!token) {
        console.error("No token found");
        return;
        }

        const res = await axios.get("http://127.0.0.1:8000/api/attendance/student-stats/", {
        headers: { 
            // IMPORTANT: Must have the "Bearer " prefix
            Authorization: `Bearer ${token}` 
        }
        });
        
        setData(res.data);
    } catch (err) {
        // If it fails with 401, it means the token in localStorage was invalid
        console.error("Attendance fetch failed:", err.response?.status);
    } finally {
        setLoading(false);
    }
    };
    fetchData();
  }, []);

  // --- Feature: Actionable Information (The Math) ---
  const percentage = useMemo(() => {
    if (!data.total_days || data.total_days === 0) return 0;
    const attended = (data.summary.PRESENT || 0) + (data.summary.LATE || 0);
    return ((attended / data.total_days) * 100).toFixed(1);
  }, [data]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;

  return (
    
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>Detailed Attendance Analysis</Typography>

        {/* --- Feature: Motivational Alert --- */}
        {percentage < 75 ? (
          <Alert severity="error" sx={{ mb: 4, fontWeight: 'bold' }}>
            Action Required: Your attendance is {percentage}%. You are below the 75% requirement!
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 4, fontWeight: 'bold' }}>
            Great Job! Your attendance is {percentage}%. You are meeting the school requirements.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* --- Feature: Actionable Gauge --- */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: 3 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>Overall Standing</Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                <CircularProgress 
                  variant="determinate" 
                  value={Number(percentage)} 
                  size={140} 
                  thickness={5} 
                  sx={{ color: percentage >= 75 ? "#2e7d32" : "#d32f2f" }}
                />
                <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4" fontWeight="bold">{percentage}%</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">Calculated from {data.total_days} total school days</Typography>
            </Card>
          </Grid>

          {/* --- Feature: Breakdown & Transparency --- */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
              <Typography variant="h6" mb={2} fontWeight="bold">Recent History</Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    {data.recent.length > 0 ? data.recent.map((record, index) => (
                      <TableRow key={index} hover>
                        <TableCell sx={{ fontWeight: 500 }}>{record.date}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={record.status} 
                            size="small"
                            sx={{ 
                                fontWeight: 'bold',
                                bgcolor: record.status === "PRESENT" ? "#e8f5e9" : "#ffebee",
                                color: record.status === "PRESENT" ? "#2e7d32" : "#d32f2f"
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    )) : (
                        <TableRow><TableCell align="center">No data found for this date range.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
   
  );
};

export default StudentAttendance;