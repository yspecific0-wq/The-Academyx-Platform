import { Breadcrumbs, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

function BreadcrumbsNav() {
  const path = useLocation().pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs sx={{ mb: 2 }}>
      <Typography color="text.primary">Home</Typography>
      {path.map((p, i) => (
        <Typography key={i} color="text.secondary">
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </Typography>
      ))}
    </Breadcrumbs>
  );
}

export default BreadcrumbsNav;
