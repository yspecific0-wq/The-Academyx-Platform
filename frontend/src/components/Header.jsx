import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Chip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SchoolIcon from "@mui/icons-material/School";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ===============================
     FETCH NOTIFICATIONS (SAFE)
  =============================== */
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return; // ⛔ do NOT call API if not logged in

    api
      .get("notifications/")
      .then((res) => {
        setNotifications(res.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          console.warn("Notifications skipped (unauthorized)");
        }
      });
  }, []);

  /* ===============================
     MENU HANDLERS
  =============================== */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* ===============================
     UI
  =============================== */
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#1f2933",
        borderBottom: "1px solid #2f3b45",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT: LOGO */}
        <Box display="flex" alignItems="center" gap={1}>
          <SchoolIcon />
          <Typography fontWeight={700} fontSize={18}>
            EduNex
          </Typography>
        </Box>

        {/* CENTER: SCHOOL NAME */}
        {user?.school?.name && (
          <Typography
            variant="body2"
            sx={{ opacity: 0.8, display: { xs: "none", md: "block" } }}
          >
            {user.school.name}
          </Typography>
        )}

        {/* RIGHT: ACTIONS */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* ROLE */}
          {user?.role && (
            <Chip
              label={user.role}
              size="small"
              sx={{
                backgroundColor: "#334155",
                color: "#e5e7eb",
                fontWeight: 600,
              }}
            />
          )}

          {/* DARK MODE ICON (placeholder) */}
          <IconButton color="inherit">
            <DarkModeIcon />
          </IconButton>

          {/* NOTIFICATIONS */}
          <IconButton color="inherit">
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* PROFILE MENU */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>
              {user?.username || "User"}
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/profile");
              }}
            >
              Profile
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
