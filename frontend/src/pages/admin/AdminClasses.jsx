import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, TextField, 
  MenuItem, CircularProgress, Alert, Snackbar 
} from "@mui/material";
import api from "../../api/axios";

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newClassName, setNewClassName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const dataFetch = async () => {
    try {
      setLoading(true);
      const [classRes, teacherRes] = await Promise.all([
        api.get("admin/classes/"),
        api.get("admin/teachers/")
      ]);
      
      setClasses(classRes.data);
      setTeachers(teacherRes.data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.status === 401 ? "Session expired." : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dataFetch();
  }, []);

  const handleCreate = async () => {
    if (!newClassName) return;
    try {
      await api.post("admin/create-class/", { 
        name: newClassName, 
        teacher_id: selectedTeacher 
      });
      setNewClassName("");
      setSelectedTeacher("");
      setSuccessMsg("Class created successfully!");
      dataFetch();
    } catch (err) {
      setError("Failed to create class.");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700}>Class & Section Management</Typography>
        <Button variant="outlined" onClick={dataFetch} size="small">Refresh Data</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none", display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField 
          label="Class Name (e.g. 10-A)" 
          value={newClassName} 
          onChange={(e) => setNewClassName(e.target.value)} 
          size="small" 
          sx={{ flexGrow: 1 }}
        />
        <TextField 
          select 
          label="Class Teacher" 
          value={selectedTeacher} 
          onChange={(e) => setSelectedTeacher(e.target.value)} 
          size="small" 
          sx={{ width: 250 }}
        >
          <MenuItem value=""><em>None (Unassigned)</em></MenuItem>
          {teachers.map((t) => (
            <MenuItem key={t.user.id} value={t.user.id}>
              {t.user.first_name} {t.user.last_name} ({t.user.username})
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleCreate} disabled={!newClassName} sx={{ bgcolor: "#0f172a" }}>
          Create Class
        </Button>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Class Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Class Teacher</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Student Count</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><CircularProgress size={24}/></TableCell></TableRow>
            ) : classes.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No classes found.</TableCell></TableRow>
            ) : (
              classes.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                  <TableCell>{c.teacher}</TableCell>
                  <TableCell>{c.student_count}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="text">View Students</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar 
        open={!!successMsg} 
        autoHideDuration={4000} 
        onClose={() => setSuccessMsg("")}
        message={successMsg}
      />
    </Box>
  );
};

export default AdminClasses;