import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, CircularProgress, Tooltip, IconButton 
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import api from "../../api/axios";

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 1. Fetch data from backend
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get("admin/teachers/");
      setTeachers(res.data);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchTeachers(); 
  }, []);

  // 2. Define all helper functions BEFORE the return
  const downloadTemplate = () => {
    const csvContent = "username,email,first_name,last_name,subject\nteacher_user,teacher@school.com,Mary,Wilson,Mathematics";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = 'teacher_template.csv'; 
    a.click();
  };

  const handleDeleteSingle = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await api.delete(`admin/delete-user/${userId}/`);
      fetchTeachers();
    } catch (err) { 
      alert("Delete failed"); 
    }
  };

  const handleDeleteBulk = async () => {
    if (!window.confirm("WARNING: This will delete ALL teachers. Proceed?")) return;
    try {
      await api.post("admin/bulk-delete/", { role: 'TEACHER' });
      fetchTeachers();
    } catch (err) { 
      alert("Bulk delete failed"); 
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      await api.post("admin/bulk-upload-teachers/", formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
      fetchTeachers();
    } catch (err) { 
      alert("Upload failed"); 
    } finally { 
      setUploading(false); 
      event.target.value = ""; 
    }
  };

  return (
    // CRITICAL: Removed <AdminLayout> wrapper to fix double-header
    <Box> 
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#0f172a">
          Teacher Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            startIcon={<DownloadIcon />} 
            onClick={downloadTemplate} 
            size="small"
            sx={{ color: "#64748b" }}
          >
            Template
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteSweepIcon />} 
            onClick={handleDeleteBulk}
          >
            Clear All
          </Button>
          <Button 
            variant="contained" 
            component="label" 
            sx={{ bgcolor: "#0f172a", '&:hover': { bgcolor: "#1e293b" } }} 
            startIcon={uploading ? <CircularProgress size={20} color="inherit"/> : <CloudUploadIcon />}
          >
            {uploading ? "Uploading..." : "Upload Teachers"}
            <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: "none", border: "1px solid #e2e8f0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Teacher Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Email</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "#475569" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={30} sx={{ color: "#38bdf8" }} />
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8, color: "#94a3b8" }}>
                  No teachers found. Please upload a CSV file to get started.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((t) => (
                <TableRow key={t.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {t.user?.first_name} {t.user?.last_name}
                  </TableCell>
                  <TableCell>{t.subject}</TableCell>
                  <TableCell>{t.user?.email}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete Teacher">
                      <IconButton color="error" onClick={() => handleDeleteSingle(t.user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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

export default AdminTeachers;