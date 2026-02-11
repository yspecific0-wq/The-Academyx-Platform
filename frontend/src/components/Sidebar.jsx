import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Stack } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation, useNavigate } from "react-router-dom";

const MENU_BY_ROLE = {
  SCHOOL_ADMIN: [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { label: "Manage Teachers", icon: <PeopleIcon />, path: "/admin/teachers" },
    { label: "Manage Classes", icon: <ClassIcon />, path: "/admin/classes" },
    { label: "Manage Students", icon: <PeopleIcon />, path: "/admin/students" },
    { label: "Manage Parents", icon: <PeopleIcon />, path: "/admin/parents" },
  ],
  PARENT: [
    { label: "Parent Dashboard", icon: <DashboardIcon />, path: "/parent" },
    { label: "Children Reports", icon: <ClassIcon />, path: "/parent/reports" },
    { label: "Profile", icon: <PersonIcon />, path: "/parent/profile" },
  ],
  DEFAULT: [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  ]
};

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve user and role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const rawRole = user?.role || "";
  const roleKey = rawRole.toUpperCase().trim().replace(/[\s-]+/g, '_');
  
  // Select menu based on role
  const menu = MENU_BY_ROLE[roleKey] || MENU_BY_ROLE.DEFAULT;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ width: 260, bgcolor: "#0F172A", color: "white", height: "100vh", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
      <Box sx={{ flexGrow: 1 }}>
        
        {/* --- BRANDING HEADER WITH YOUR LOGO --- */}
        <Stack spacing={1} alignItems="center" sx={{ p: 4 }}>
          <Box 
            component="img" 
            src="/logo.png" // Pointing to public/logo.png
            alt="The Academyx Logo"
            sx={{ height: 55, width: "auto", mb: 1, objectFit: "contain" }} 
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: "1rem", letterSpacing: 2, color: "white", lineHeight: 1 }}>
              THE ACADEMYX
            </Typography>
            <Typography variant="caption" sx={{ color: "#3b82f6", fontWeight: 800, textTransform: "uppercase", fontSize: "0.6rem", letterSpacing: 1.5 }}>
              {roleKey.replace('_', ' ')} PORTAL
            </Typography>
          </Box>
        </Stack>

        <List sx={{ px: 2 }}>
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton 
                key={item.label} 
                onClick={() => navigate(item.path)} 
                selected={isActive}
                sx={{ 
                  borderRadius: "0px", // Geometric theme
                  mb: 0.5,
                  bgcolor: isActive ? "rgba(59, 130, 246, 0.1) !important" : "transparent",
                  borderLeft: isActive ? "4px solid #3b82f6" : "4px solid transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "#3b82f6" : "#9ca3af", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: isActive ? 800 : 500 }} 
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* --- LOGOUT SECTION --- */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: "0px" }}>
          <ListItemIcon sx={{ color: "#ef4444", minWidth: 40 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: 700, color: "#ef4444" }} />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default Sidebar;