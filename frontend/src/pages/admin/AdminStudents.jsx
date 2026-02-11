import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, TextField,
  Tooltip, IconButton
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SyncIcon from '@mui/icons-material/Sync';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import api from "../../api/axios";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  const [linkOpen, setLinkOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedParentId, setSelectedParentId] = useState("");

  const fetchStudents = async () => {
    try { 
      setLoading(true); 
      const res = await api.get("admin/students/"); 
      setStudents(res.data); 
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const fetchParents = async () => {
    try { 
      const res = await api.get("parents-list/"); 
      setParents(res.data); 
    } catch (err) { 
      console.error(err); 
    }
  };

  useEffect(() => { 
    fetchStudents(); 
    fetchParents(); 
  }, []);

  const downloadTemplate = () => {
    const csvContent = "username,email,first_name,last_name,class_name,parent_email\nstudent_user,student@email.com,John,Doe,Grade 10,parent@email.com";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'student_template.csv'; a.click();
  };

  const handleDeleteSingle = async (userId) => {
    if (!window.confirm("Permanently delete this student?")) return;
    try { await api.delete(`admin/delete-user/${userId}/`); fetchStudents(); } catch (err) { alert("Delete failed"); }
  };

  const handleDeleteBulk = async () => {
    if (!window.confirm("Clear all student records?")) return;
    try { await api.post("admin/bulk-delete/", { role: 'STUDENT' }); fetchStudents(); } catch (err) { alert("Bulk delete failed"); }
  };

  const handleSyncLinks = async () => {
    try { setSyncing(true); await api.post("admin/sync-links/"); fetchStudents(); } 
    catch (err) { alert("Sync failed"); } finally { setSyncing(false); }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData(); formData.append("file", file);
    try {
      setUploading(true);
      await api.post("admin/bulk-upload-students/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      fetchStudents();
    } catch (err) { alert("Upload failed"); } finally { setUploading(false); event.target.value = ""; }
  };

  const handleOpenLink = (student) => { setSelectedStudent(student); setLinkOpen(true); };
  const handleCloseLink = () => { setLinkOpen(false); setSelectedStudent(null); setSelectedParentId(""); };

  const handleConfirmLink = async () => {
    try {
      await api.post("admin/link-student/", { student_id: selectedStudent.id, parent_id: selectedParentId });
      handleCloseLink(); fetchStudents();
    } catch (err) { console.error(err); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Student Management</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<DownloadIcon />} onClick={downloadTemplate} size="small">Template</Button>
          <Button variant="outlined" color="error" startIcon={<DeleteSweepIcon />} onClick={handleDeleteBulk}>Clear All</Button>
          <Tooltip title="Match by email">
            <span>
              <Button variant="outlined" color="info" onClick={handleSyncLinks} disabled={syncing} startIcon={syncing ? <CircularProgress size={20}/> : <SyncIcon />}>
                Sync Links
              </Button>
            </span>
          </Tooltip>
          <Button variant="contained" component="label" sx={{ bgcolor: "#0f172a" }} startIcon={uploading ? <CircularProgress size={20} color="inherit"/> : <CloudUploadIcon />}>
            Upload Students
            <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Class</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Parent Link</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><CircularProgress size={24}/></TableCell></TableRow>
            ) : students.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No students found.</TableCell></TableRow>
            ) : (
              students.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{s.user?.username}</TableCell>
                  <TableCell>{s.class_name}</TableCell>
                  <TableCell>{s.parent_link ? "✓ Confirmed" : "⚠ Unlinked"}</TableCell>
                  <TableCell align="right">
                    {!s.parent_link && <Button size="small" onClick={() => handleOpenLink(s)} sx={{ mr: 1 }}>Link</Button>}
                    <IconButton color="error" onClick={() => handleDeleteSingle(s.user.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={linkOpen} onClose={handleCloseLink} fullWidth maxWidth="xs">
        <DialogTitle>Link Parent</DialogTitle>
        <DialogContent>
          <TextField select fullWidth label="Select Parent" sx={{ mt: 2 }} value={selectedParentId} onChange={(e) => setSelectedParentId(e.target.value)}>
            {parents.map((p) => <MenuItem key={p.id} value={p.id}>{p.user?.username}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseLink}>Cancel</Button>
          <Button onClick={handleConfirmLink} variant="contained" disabled={!selectedParentId}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default AdminStudents;