import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, CircularProgress, IconButton, Tooltip 
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import api from "../../api/axios";

const AdminParents = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const res = await api.get("parents-list/");
      setParents(res.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchParents(); }, []);

  const downloadTemplate = () => {
    const csvContent = "username,email,first_name,last_name\nparent_user,parent@email.com,Jane,Doe";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'parent_template.csv'; a.click();
  };

  const handleDeleteSingle = async (userId) => {
    if (!window.confirm("Delete this parent profile?")) return;
    try {
      await api.delete(`admin/delete-user/${userId}/`);
      fetchParents();
    } catch (err) { alert("Delete failed"); }
  };

  const handleDeleteBulk = async () => {
    if (!window.confirm("Clear all parents? Students will become unlinked.")) return;
    try {
      await api.post("admin/bulk-delete/", { role: 'PARENT' });
      fetchParents();
    } catch (err) { alert("Bulk delete failed"); }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      await api.post("admin/bulk-upload-parents/", formData, { headers: { "Content-Type": "multipart/form-data" } });
      fetchParents();
    } catch (err) { alert("Upload failed"); } finally { setUploading(false); event.target.value = ""; }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Parent Management</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button startIcon={<DownloadIcon />} onClick={downloadTemplate} size="small">Template</Button>
          <Button variant="outlined" color="error" startIcon={<DeleteSweepIcon />} onClick={handleDeleteBulk}>Clear All</Button>
          <Button variant="contained" component="label" sx={{ bgcolor: "#0f172a" }} startIcon={uploading ? <CircularProgress size={20} color="inherit"/> : <CloudUploadIcon />}>
            {uploading ? "Uploading..." : "Upload Parents"}
            <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Parent Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><CircularProgress size={24}/></TableCell></TableRow>
            ) : parents.length === 0 ? (
              <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No parents found.</TableCell></TableRow>
            ) : (
              parents.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{p.user?.first_name} {p.user?.last_name}</TableCell>
                  <TableCell>{p.user?.email}</TableCell>
                  <TableCell>{p.user?.username}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => handleDeleteSingle(p.user.id)}><DeleteIcon /></IconButton>
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
export default AdminParents;