import { Box, Drawer } from "@mui/material";
import { useState } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import BreadcrumbsNav from "./BreadcrumbsNav";

function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setOpen(true)} />

      {/* Mobile Sidebar */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Sidebar />
      </Drawer>

      {/* Desktop Sidebar */}
      <Sidebar />

      <Box
        sx={{
          ml: { md: "240px" },
          mt: "64px",
          p: 3,
          backgroundColor: "#f3f4f6",
          minHeight: "100vh",
        }}
      >
        <BreadcrumbsNav />
        {children}
      </Box>
    </>
  );
}

export default Layout;
