import { Box, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { ROLES } from "../utils/roles";

const sidebarItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Teachers", path: "/admin/teachers" },
  { label: "Students", path: "/admin/students" },
  { label: "Classes", path: "/admin/classes" },
  { label: "Notifications", path: "/admin/notifications" },
  { label: "Reports", path: "/admin/reports" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  // Safety: sidebar only for Admin
  if (!user || user.role !== ROLES.ADMIN) return null;

  return (
    <Box
      sx={{
        width: 240,
        minHeight: "100vh",
        backgroundColor: "#111827",
        color: "#e5e7eb",
        paddingTop: 2,
        position: "fixed",
        left: 0,
        top: 64, // height of header
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ px: 3, mb: 1, color: "#9ca3af" }}
      >
        SCHOOL ADMIN
      </Typography>

      <List>
        {sidebarItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              "&.Mui-selected": {
                backgroundColor: "#1f2937",
              },
              "&:hover": {
                backgroundColor: "#1f2937",
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default AdminSidebar;
