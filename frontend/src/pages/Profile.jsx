import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, TextField, Button, Avatar, 
  Alert, Snackbar, CircularProgress 
} from "@mui/material";
import { Save, Lock } from "@mui/icons-material";
import api from "../api/axios"; 

const Profile = () => {
  const [formData, setFormData] = useState({ 
    first_name: "", 
    last_name: "", 
    username: "", 
    email: "" 
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });

  // Dynamically get role from localStorage
  const displayRole = localStorage.getItem("role") || "USER";

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("profile/"); 
      setFormData(res.data);
    } catch (err) {
      setToast({ open: true, msg: "Failed to load profile data", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("profile/", formData);
      setToast({ open: true, msg: "Profile updated successfully!", severity: "success" });
    } catch (err) {
      setToast({ open: true, msg: "Update failed. Check your network.", severity: "error" });
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1000, margin: "0 auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: "#1A2027" }}>
        Account Settings
      </Typography>

      <Grid container spacing={4}>
        {/* LEFT: Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 5, border: "1px solid #E0E4E8", bgcolor: "#F8FAFC" }}>
            <Avatar 
              sx={{ 
                width: 120, height: 120, margin: '0 auto', 
                bgcolor: "#3b82f6", fontSize: "3rem", 
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)" 
              }}
            >
              {(formData.first_name?.charAt(0) || formData.username?.charAt(0) || "U").toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold" }}>
              {formData.first_name} {formData.last_name}
            </Typography>
            <Typography color="textSecondary" variant="body2" gutterBottom sx={{ wordBreak: 'break-all' }}>
              {formData.email}
            </Typography>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: "#fff", borderRadius: 3, border: "1px dashed #CBD5E1" }}>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
                Account Role
              </Typography>
              <Typography variant="body1" fontWeight="600" color="primary">
                {displayRole.replace("_", " ")}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT: Detailed Forms */}
        <Grid item xs={12} md={8}>
          <Box component="form" onSubmit={handleUpdate}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: "1px solid #E0E4E8", mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" mb={3}>Personal Details</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="First Name" variant="outlined"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth label="Last Name" variant="outlined"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth label="Username" variant="outlined" disabled
                    value={formData.username}
                    helperText="Username cannot be changed"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth label="Email Address" variant="outlined" disabled
                    value={formData.email}
                    helperText="Contact Admin to change email"
                  />
                </Grid>
              </Grid>
              <Button 
                type="submit" variant="contained" 
                startIcon={<Save />}
                sx={{ mt: 4, px: 4, py: 1.5, borderRadius: 2, fontWeight: "bold", textTransform: "none", bgcolor: "#0f172a" }}
              >
                Save Profile Changes
              </Button>
            </Paper>
          </Box>

          {/* Change Password Section */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: "1px solid #E0E4E8" }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Lock sx={{ mr: 1, color: "#f59e0b" }} />
              <Typography variant="h6" fontWeight="bold">Security</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Secure your account by updating your password regularly.
            </Typography>
            <Button variant="outlined" color="inherit" sx={{ borderRadius: 2, textTransform: "none" }}>
              Change Password
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;