import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Radio, RadioGroup, 
  FormControlLabel, Button, CircularProgress, Alert, TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../api/axios"; 

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredStudents = students.filter(s => {
    const firstName = s.user?.first_name || s.first_name || "";
    const lastName = s.user?.last_name || s.last_name || "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetches students specifically assigned to this teacher
        const studentRes = await api.get("accounts/teacher-students/"); 
        setStudents(studentRes.data);
        
        // Loads existing records for the date so they aren't overwritten by blank ones
        const attendanceRes = await api.get(`attendance/submit/?date=${selectedDate}`);
        setAttendanceData(attendanceRes.data || {});
      } catch (err) {
        setMessage({ type: "error", text: "Error syncing data from server." });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedDate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      // Sends 'attendance' key containing IDs as keys to match backend logic
      await api.post("attendance/submit/", { 
        date: selectedDate, 
        attendance: attendanceData 
      });  
      setMessage({ type: "success", text: "Attendance records saved successfully!" });
    } catch (err) {
      // Captures specific backend errors like the "UserProfile instance" mismatch
      const errorDetail = err.response?.data?.error || "Failed to save records.";
      setMessage({ type: "error", text: errorDetail });
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAllPresent = () => {
    const allP = {};
    students.forEach(s => {
      // Uses numeric s.id to ensure backend Integer lookup works
      allP[s.id] = "PRESENT";
    });
    setAttendanceData(allP);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F172A", fontFamily: "'Playfair Display', serif" }}>
          Mark Attendance
        </Typography>
        <TextField 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ bgcolor: "white" }}
        />
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField 
          size="small" 
          placeholder="Search students..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          InputProps={{ 
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> 
          }}
          sx={{ bgcolor: "white", width: 300 }}
        />
        <Button 
          variant="outlined" 
          onClick={handleMarkAllPresent}
          sx={{ borderRadius: 0, fontWeight: 700, borderColor: "#1A56DB", color: "#1A56DB" }}
        >
          Mark All Present
        </Button>
      </Box>

      {message.text && <Alert severity={message.type} sx={{ mb: 2, borderRadius: 0 }}>{message.text}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 0, border: "1px solid #E2E8F0", boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#0F172A" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: 800 }}>STUDENT NAME</TableCell>
              <TableCell align="center" sx={{ color: "white", fontWeight: 800 }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={24} sx={{ color: "#1A56DB" }} />
                </TableCell>
              </TableRow>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {s.user?.first_name || s.first_name} {s.user?.last_name || s.last_name}
                  </TableCell>
                  <TableCell align="center">
                    <RadioGroup 
                      row 
                      // Numeric ID matches UserProfile primary key on backend
                      value={attendanceData[s.id] || ""} 
                      onChange={(e) => setAttendanceData({...attendanceData, [s.id]: e.target.value})}
                      sx={{ justifyContent: "center" }}
                    >
                      <FormControlLabel value="PRESENT" control={<Radio color="success" />} label="P" />
                      <FormControlLabel value="ABSENT" control={<Radio color="error" />} label="A" />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ py: 5 }}>No students found for your classes.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Button 
        variant="contained" 
        sx={{ mt: 3, bgcolor: "#1A56DB", borderRadius: 0, px: 4, py: 1.5, fontWeight: 800 }} 
        onClick={handleSubmit} 
        disabled={submitting || students.length === 0}
      >
        {submitting ? "Saving..." : "Save Records"}
      </Button>
    </Box>
  );
};

export default MarkAttendance;