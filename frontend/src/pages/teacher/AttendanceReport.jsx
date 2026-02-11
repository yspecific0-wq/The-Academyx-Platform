import React, { useState } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField, 
  Grid, CircularProgress, Alert 
} from "@mui/material";
import api from "../../api/axios"; 

const AttendanceReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`attendance/report/?start_date=${startDate}&end_date=${endDate}`);
      setReportData(response.data);
    } catch (err) {
      setError("Failed to fetch report. Ensure the backend view is ready.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>Attendance Analytics & Reports</Typography>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="From Date" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="To Date" type="date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button variant="contained" fullWidth size="large" onClick={fetchReport} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Report"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Student Name</TableCell>
              <TableCell align="center" sx={{ color: "white" }}>Present</TableCell>
              <TableCell align="center" sx={{ color: "white" }}>Absent</TableCell>
              <TableCell align="center" sx={{ color: "white" }}>Attendance %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.first_name} {row.last_name}</TableCell>
                <TableCell align="center">{row.total_present}</TableCell>
                <TableCell align="center">{row.total_absent}</TableCell>
                <TableCell align="center">
                  {((row.total_present / (row.total_present + row.total_absent)) * 100 || 0).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceReport;