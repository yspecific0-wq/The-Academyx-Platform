import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Typography, AppBar, Toolbar, Avatar, Divider, Stack 
} from "@mui/material";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AssessmentIcon from "@mui/icons-material/Assessment"; 
import ClassIcon from "@mui/icons-material/Class";

const drawerWidth = 280; // Slightly wider for a "classy" spacious feel

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const username = localStorage.getItem("username") || "User";
  const userRole = localStorage.getItem("role") || "STUDENT";

  const roleMenus = {
    SCHOOL_ADMIN: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
      { text: "Manage Teachers", icon: <PeopleIcon />, path: "/admin/teachers" },
      { text: "Teacher Attendance", icon: <AssignmentIndIcon />, path: "/admin/teacher-attendance" }, 
      { text: "Manage Students", icon: <SchoolIcon />, path: "/admin/students" },
      { text: "Manage Parents", icon: <PeopleIcon />, path: "/admin/parents" },
      { text: "Manage Classes", icon: <ClassIcon />, path: "/admin/classes" },
      { text: "Profile", icon: <AccountCircleIcon />, path: "/admin/profile" },
    ],
    TEACHER: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/teacher" },
      { text: "Mark Attendance", icon: <AssignmentIndIcon />, path: "/teacher/attendance" },
      { text: "Attendance Reports", icon: <AssessmentIcon />, path: "/teacher/reports" },
      { text: "Profile", icon: <AccountCircleIcon />, path: "/teacher/profile" },
    ],
    STUDENT: [
      { text: "My Dashboard", icon: <DashboardIcon />, path: "/student" },
      { text: "Attendance Record", icon: <AnalyticsIcon />, path: "/student/attendance" },
      { text: "My Classes", icon: <SchoolIcon />, path: "/student/classes" },
      { text: "My Teachers", icon: <PeopleIcon />, path: "/student/teachers" },
      { text: "Profile", icon: <AccountCircleIcon />, path: "/student/profile" },
    ],
    PARENT: [
      { text: "Parent Dashboard", icon: <DashboardIcon />, path: "/parent" },
      { text: "Children Reports", icon: <AnalyticsIcon />, path: "/parent/reports" },
      { text: "Profile", icon: <AccountCircleIcon />, path: "/parent/profile" },
    ]
  };

  const menuItems = roleMenus[userRole] || roleMenus["ADMIN"];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const formatRole = (role) => role.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

  return (
    <Box sx={{ display: "flex", bgcolor: "#F3F4F6", minHeight: "100vh" }}>
      {/* 1. Sidebar - Classy White Theme */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#FFFFFF", 
            color: "#4B5563",
            borderRight: "1px solid #E5E7EB",
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Logo Placeholder - You can replace Typography with an <img> tag later */}
          <Typography variant="h5" sx={{ color: "#1A56DB", fontWeight: 900, letterSpacing: -1 }}>
            THE ACADEMYX
          </Typography>
          <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, mt: 0.5 }}>
            {formatRole(userRole)} PORTAL
          </Typography>
        </Box>

        <Divider sx={{ mx: 2, mb: 2 }} />

        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: "10px",
                    color: isActive ? "#1A56DB" : "#4B5563",
                    "&.Mui-selected": { 
                      bgcolor: "rgba(26, 86, 219, 0.08)", 
                      color: "#1A56DB",
                      "& .MuiListItemIcon-root": { color: "#1A56DB" },
                      "&:hover": { bgcolor: "rgba(26, 86, 219, 0.12)" }
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? "#1A56DB" : "#9CA3AF", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: "0.95rem" }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: "10px", color: "#EF4444" }}>
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* 2. Main Layout Container */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Header - Simple & Clean */}
        <AppBar 
          position="sticky" 
          sx={{ 
            bgcolor: "#FFFFFF", 
            color: "#111827", 
            boxShadow: "none", 
            borderBottom: "1px solid #E5E7EB" 
          }}
        >
          <Toolbar sx={{ justifyContent: "flex-end", px: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box textAlign="right">
                <Typography variant="subtitle2" fontWeight={700}>{username}</Typography>
                <Typography variant="caption" color="textSecondary">{formatRole(userRole)}</Typography>
              </Box>
              <Avatar 
                sx={{ 
                  bgcolor: "#1A56DB", 
                  color: "white",
                  fontWeight: 800,
                  width: 42,
                  height: 42,
                  fontSize: "1rem"
                }}
              >
                {username[0]?.toUpperCase()}
              </Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* 3. Page Content */}
        <Box sx={{ p: 4, flexGrow: 1, overflowY: "auto" }}>
          <Outlet /> 
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;