import { Box, Typography } from "@mui/material";

const TableEmptyState = ({ message }) => {
  return (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography color="error">
        {message}
      </Typography>
    </Box>
  );
};

export default TableEmptyState;
