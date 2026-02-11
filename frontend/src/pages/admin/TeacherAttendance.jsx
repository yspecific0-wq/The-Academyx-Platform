import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, Chip, CircularProgress 
} from "@mui/material";
import api from "../../api/axios";

const TeacherAttendance = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-GB');

  useEffect(() => {
    api.get("admin/teachers/")
      .then(res => {
        // Initialize teachers with a default 'Pending' status for today
        const data = res.data.map(t => ({ ...t, status: "Pending" }));
        setTeachers(data);
      })
      .catch(err => console.error("Error fetching teachers for attendance:", err))
      .finally(() => setLoading(false));
  }, []);

  const markAttendance = (id, status) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    // Optional: api.post("admin/mark-attendance/", { teacher_id: id, status, date: today });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Teacher Attendance</Typography>
        <Typography variant="body2" color="textSecondary">Date: {today}</Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Teacher Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Mark Attendance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">No teachers found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t.user?.first_name && t.user?.last_name 
                      ? `${t.user.first_name} ${t.user.last_name}` 
                      : t.user?.username || "Unknown Teacher"}
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={t.status} 
                      color={t.status === "Present" ? "success" : t.status === "Absent" ? "error" : "default"} 
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      variant={t.status === "Present" ? "contained" : "outlined"}
                      color="success"
                      onClick={() => markAttendance(t.id, "Present")} 
                      sx={{ mr: 1, borderRadius: 1.5 }}
                    >
                      Present
                    </Button>
                    <Button 
                      size="small" 
                      variant={t.status === "Absent" ? "contained" : "outlined"}
                      color="error"
                      onClick={() => markAttendance(t.id, "Absent")}
                      sx={{ borderRadius: 1.5 }}
                    >
                      Absent
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeacherAttendance;