import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, 
  CircularProgress, Stack, Container 
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios"; 

const ChildReport = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  // Grabs the studentId from the URL (e.g., /parent/reports/33)
  const { studentId } = useParams(); 
  const navigate = useNavigate();

  const brandBlue = "#1A56DB";
  const darkNavy = "#0F172A";

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        // Calls the attendance endpoint with the specific student filter
        const res = await api.get(`attendance/report/?student_id=${studentId}`);
        // Ensure res.data is an array to prevent .map() crashes
        setAttendance(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Report Fetch Error:", err);
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchReport();
  }, [studentId]);

  if (loading) return (
    <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: "#F8FAFC" }}>
      <CircularProgress sx={{ color: brandBlue }} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* --- DYNAMIC HEADER --- */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton 
            onClick={() => navigate("/parent")} 
            sx={{ 
              borderRadius: "0px", 
              bgcolor: "white", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              "&:hover": { bgcolor: "#f1f5f9" }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, color: darkNavy }}>
              Attendance History
            </Typography>
            <Typography variant="caption" sx={{ color: brandBlue, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase" }}>
              Student Reference: #{studentId}
            </Typography>
          </Box>
        </Stack>

        {/* --- DATA TABLE --- */}
        <TableContainer component={Paper} sx={{ borderRadius: "0px", border: "1px solid #E2E8F0", boxShadow: "none" }}>
          <Table>
            <TableHead sx={{ bgcolor: darkNavy }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: 800, letterSpacing: 1 }}>DATE</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 800, letterSpacing: 1 }}>STATUS</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 800, letterSpacing: 1 }}>REMARKS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.length > 0 ? (
                attendance.map((row) => (
                  <TableRow key={row.id} hover sx={{ "&:hover": { bgcolor: "#F1F5F9" } }}>
                    <TableCell sx={{ fontWeight: 700, color: darkNavy }}>
                      {/* Formats date safely for display */}
                      {row.date ? new Date(row.date).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      }) : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status || "N/A"} 
                        sx={{ 
                          borderRadius: "2px", 
                          fontWeight: 900,
                          fontSize: "0.75rem",
                          bgcolor: row.status === "PRESENT" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                          color: row.status === "PRESENT" ? "#059669" : "#DC2626",
                          border: `1px solid ${row.status === "PRESENT" ? "#10B981" : "#EF4444"}`
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#64748B", fontStyle: row.remarks ? "normal" : "italic" }}>
                      {row.remarks || "No remarks recorded"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                    <Typography variant="body2" sx={{ color: "#94A3B8", fontWeight: 700 }}>
                      No attendance records discovered for this student reference.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default ChildReport;